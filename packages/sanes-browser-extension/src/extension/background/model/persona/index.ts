import { Address, Amount, ChainId, isSendTransaction, SendTransaction, UnsignedTransaction } from "@iov/bcp";
import {
  bnsCodec,
  BnsConnection,
  BnsUsernameNft,
  CreateProposalTx,
  isCreateProposalTx,
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRegisterUsernameTx,
  isReplaceAccountTargetsTx,
  isUpdateTargetsOfUsernameTx,
  isVoteTx,
  RegisterAccountTx,
  RegisterDomainTx,
  RegisterUsernameTx,
  ReplaceAccountTargetsTx,
  UpdateTargetsOfUsernameTx,
  VoteTx,
} from "@iov/bns";
import { Bip39, Random } from "@iov/crypto";
import { UserProfile, UserProfileEncryptionKey } from "@iov/keycontrol";
import {
  GetIdentitiesAuthorization,
  JsonRpcSigningServer,
  MultiChainSigner,
  SignAndPostAuthorization,
  SigningServerCore,
} from "@iov/multichain";

import { AccountInfo, AccountManager } from "../accountManager";
import {
  SoftwareAccountManager,
  SoftwareAccountManagerChainConfig,
} from "../accountManager/softwareAccountManager";
import { StringDb } from "../backgroundscript/db";
import { algorithmForCodec, chainConnector, getChains, pathBuilderForCodec } from "./config";
import { createTwoWalletProfile } from "./userprofilehelpers";

function isNonUndefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}

/**
 * All transaction types that can be displayed and signed by the extension
 */
export type SupportedTransaction =
  | SendTransaction
  | RegisterUsernameTx
  | UpdateTargetsOfUsernameTx
  | RegisterDomainTx
  | RegisterAccountTx
  | ReplaceAccountTargetsTx
  | CreateProposalTx
  | VoteTx;

export function isSupportedTransaction(tx: UnsignedTransaction): tx is SupportedTransaction {
  return (
    isSendTransaction(tx) ||
    isRegisterUsernameTx(tx) ||
    isUpdateTargetsOfUsernameTx(tx) ||
    isRegisterDomainTx(tx) ||
    isRegisterAccountTx(tx) ||
    isReplaceAccountTargetsTx(tx) ||
    isCreateProposalTx(tx) ||
    isVoteTx(tx)
  );
}

export interface AuthorizationCallbacks {
  readonly authorizeGetIdentities: GetIdentitiesAuthorization;
  readonly authorizeSignAndPost: SignAndPostAuthorization;
}

export interface MakeAuthorizationCallbacks {
  (signer: MultiChainSigner): AuthorizationCallbacks;
}

/**
 * An account
 *
 * All fields must be losslessly JSON serializable/deserializable to allow
 * messaging between background script and UI.
 */
export interface PersonaAcccount {
  /** human readable address or placeholder text */
  readonly label: string;
  readonly iovAddress: Address;
}

export type UseOnlyJsonRpcSigningServer = Pick<JsonRpcSigningServer, "handleUnchecked" | "handleChecked">;

export class Persona {
  private readonly encryptionKey: UserProfileEncryptionKey;
  private readonly profile: UserProfile;
  private readonly signer: MultiChainSigner;
  private readonly accountManager: AccountManager;
  private readonly core: SigningServerCore;
  private readonly jsonRpcSigningServer: JsonRpcSigningServer;

  public get signingServer(): UseOnlyJsonRpcSigningServer {
    return this.jsonRpcSigningServer;
  }

  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async create(
    db: StringDb,
    password: string,
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks | undefined,
    fixedMnemonic?: string,
  ): Promise<Persona> {
    const encryptionKey = await UserProfile.deriveEncryptionKey(password);

    const entropyBytes = 16;
    const mnemonic = fixedMnemonic || Bip39.encode(await Random.getBytes(entropyBytes)).toString();
    const profile = createTwoWalletProfile(mnemonic);
    const signer = new MultiChainSigner(profile);
    const managerChains = await Persona.connectToAllConfiguredChains(signer);
    const manager = new SoftwareAccountManager(profile, managerChains);

    // Setup initial account of index 0
    await manager.generateNextAccount();
    await profile.storeIn(db, encryptionKey);

    return new Persona(encryptionKey, profile, signer, manager, makeAuthorizationCallbacks);
  }

  public static async load(
    db: StringDb,
    password: string,
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks | undefined,
  ): Promise<Persona> {
    const encryptionKey = await UserProfile.deriveEncryptionKey(password);

    const profile = await UserProfile.loadFrom(db, encryptionKey);
    const signer = new MultiChainSigner(profile);
    const managerChains = await Persona.connectToAllConfiguredChains(signer);
    const manager = new SoftwareAccountManager(profile, managerChains);

    return new Persona(encryptionKey, profile, signer, manager, makeAuthorizationCallbacks);
  }

  private static async connectToAllConfiguredChains(
    signer: MultiChainSigner,
  ): Promise<readonly SoftwareAccountManagerChainConfig[]> {
    const managerChains: SoftwareAccountManagerChainConfig[] = [];

    for (const chainSpec of (await getChains()).map(chain => chain.chainSpec)) {
      const connector = chainConnector(chainSpec);

      try {
        const { connection } = await signer.addChain(connector);
        managerChains.push({
          chainId: connection.chainId,
          algorithm: algorithmForCodec(chainSpec.codecType),
          derivePath: pathBuilderForCodec(chainSpec.codecType),
        });
      } catch (e) {
        console.error("Could not add chain. " + e);
      }
    }

    return managerChains;
  }

  /**
   * The given signer and accountsManager must share the same UserProfile.
   * All changes are automatically saved in db.
   */
  private constructor(
    encryptionKey: UserProfileEncryptionKey,
    profile: UserProfile,
    signer: MultiChainSigner,
    accountManager: AccountManager,
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks | undefined,
  ) {
    this.encryptionKey = encryptionKey;
    this.profile = profile;
    this.signer = signer;
    this.accountManager = accountManager;

    const { authorizeGetIdentities, authorizeSignAndPost } = makeAuthorizationCallbacks
      ? makeAuthorizationCallbacks(signer)
      : {
          authorizeGetIdentities: () => {
            throw new Error("No authorizeGetIdentities callback set");
          },
          authorizeSignAndPost: () => {
            throw new Error("No authorizeSignAndPost callback set");
          },
        };

    this.core = new SigningServerCore(
      this.profile,
      this.signer,
      authorizeGetIdentities,
      authorizeSignAndPost,
      console.error,
    );
    this.jsonRpcSigningServer = new JsonRpcSigningServer(this.core);
  }

  public destroy(): void {
    this.jsonRpcSigningServer.shutdown();
    this.signer.shutdown();
  }

  public async createAccount(db: StringDb): Promise<void> {
    await this.accountManager.generateNextAccount();
    await this.profile.storeIn(db, this.encryptionKey);
  }

  public async getAccounts(): Promise<readonly PersonaAcccount[]> {
    const accounts = await this.accountManager.accounts();

    try {
      const bnsConnection = this.getBnsConnection();

      return Promise.all(
        accounts.map(async (account, index) => {
          const bnsIdentity = account.identities.find(ident => ident.chainId === bnsConnection.chainId);
          if (!bnsIdentity) {
            throw new Error(`Missing BNS identity for account at index ${index}`);
          }

          const iovAddress = this.signer.identityToAddress(bnsIdentity);
          let label: string;
          const names = await bnsConnection.getUsernames({ owner: iovAddress });
          if (names.length > 1) {
            // this case will not happen for regular users that do not professionally collect username NFTs
            label = `Multiple names`;
          } else if (names.length === 1) {
            label = `${names[0].id}`;
          } else {
            label = `Account ${account.index}`;
          }

          return { label, iovAddress };
        }),
      );
    } catch {
      return [];
    }
  }

  public get mnemonic(): string {
    const wallets = this.profile.wallets.value;
    const mnemonics = new Set(wallets.map(info => this.profile.printableSecret(info.id)));

    if (mnemonics.size !== 1) {
      throw new Error("Found multiple different mnemoics in different wallets. This is not supported.");
    }

    return mnemonics.values().next().value;
  }

  public get connectedChains(): readonly ChainId[] {
    return this.signer.chainIds();
  }

  public async getBalances(): Promise<readonly (readonly Amount[])[]> {
    const accountsInfos = await this.accountManager.accounts();

    const balancesPerAccount = await Promise.all(
      accountsInfos.map(
        async (accountInfo: AccountInfo): Promise<readonly Amount[]> => {
          const balances = (
            await Promise.all(
              accountInfo.identities.map(async identity => {
                const { chainId, pubkey } = identity;
                try {
                  const account = await this.signer.connection(chainId).getAccount({ pubkey });
                  return account;
                } catch {
                  return undefined;
                }
              }),
            )
          )
            .filter(isNonUndefined)
            .flatMap(account => account.balance);

          return balances;
        },
      ),
    );

    return balancesPerAccount;
  }

  public async getStarnames(): Promise<readonly string[]> {
    const starnames: BnsUsernameNft[] = [];

    try {
      const bnsConnection = this.getBnsConnection();
      const accounts = await this.accountManager.accounts();
      const bnsIdentities = accounts
        .flatMap(account => account.identities)
        .filter(ident => ident.chainId === bnsConnection.chainId);

      await Promise.all(
        bnsIdentities.map(async bnsIdentity => {
          const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);
          starnames.push(...(await bnsConnection.getUsernames({ owner: bnsAddress })));
        }),
      );

      return starnames.map(username => username.id);
    } catch {
      return [];
    }
  }

  private getBnsConnection(): BnsConnection {
    for (const chainId of this.signer.chainIds()) {
      const connection = this.signer.connection(chainId);
      if (connection instanceof BnsConnection) {
        return connection;
      }
    }

    throw new Error("No BNS connection found");
  }
}
