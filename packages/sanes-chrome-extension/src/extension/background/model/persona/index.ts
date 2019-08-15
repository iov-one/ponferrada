import { isSendTransaction, SendTransaction, UnsignedTransaction, WithCreator } from "@iov/bcp";
import { BnsConnection, isRegisterUsernameTx, RegisterUsernameTx } from "@iov/bns";
import { Bip39, Random } from "@iov/crypto";
import { Encoding } from "@iov/encoding";
import { UserProfile } from "@iov/keycontrol";
import { UserProfileEncryptionKey } from "@iov/keycontrol";
import {
  GetIdentitiesAuthorization,
  MultiChainSigner,
  SignAndPostAuthorization,
  SignedAndPosted,
  SigningServerCore,
} from "@iov/multichain";
import { ReadonlyDate } from "readonly-date";

import { transactionsUpdater } from "../../updaters/appUpdater";
import { AccountManager, AccountManagerChainConfig } from "../accountManager";
import { StringDb } from "../backgroundscript/db";
import {
  algorithmForCodec,
  chainConnector,
  codecTypeFromString,
  ConfigurationFile,
  getConfigurationFile,
  pathBuilderForCodec,
} from "./config";
import { createTwoWalletProfile } from "./userprofilehelpers";

function isNonNull<T>(t: T | null): t is T {
  return t !== null;
}

/**
 * All transaction types that can be displayed and signed by the extension
 */
export type SupportedTransaction = (SendTransaction | RegisterUsernameTx) & WithCreator;

export function isSupportedTransaction(tx: UnsignedTransaction): tx is SupportedTransaction {
  return isSendTransaction(tx) || isRegisterUsernameTx(tx);
}

/**
 * A transaction signed by the user of the extension.
 */
export interface ProcessedTx {
  readonly id: string;
  readonly signer: string;
  readonly time: string;
  readonly blockExplorerUrl: string | null;
  /** If error is null, the transaction succeeded */
  readonly error: string | null;
  readonly original: SupportedTransaction;
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
}

export class Persona {
  private readonly encryptionKey: UserProfileEncryptionKey;
  private readonly profile: UserProfile;
  private readonly signer: MultiChainSigner;
  private readonly accountManager: AccountManager;
  private readonly core: SigningServerCore;

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
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks,
    fixedMnemonic?: string,
  ): Promise<Persona> {
    const encryptionKey = await UserProfile.deriveEncryptionKey(password);

    const entropyBytes = 16;
    const mnemonic = fixedMnemonic || Bip39.encode(await Random.getBytes(entropyBytes)).asString();
    const profile = createTwoWalletProfile(mnemonic);
    const signer = new MultiChainSigner(profile);
    const managerChains = await Persona.connectToAllConfiguredChains(signer);
    const manager = new AccountManager(profile, managerChains);

    // Setup initial account of index 0
    await manager.generateNextAccount();
    await profile.storeIn(db, encryptionKey);

    return new Persona(encryptionKey, profile, signer, manager, makeAuthorizationCallbacks);
  }

  public static async load(
    db: StringDb,
    password: string,
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks,
  ): Promise<Persona> {
    const encryptionKey = await UserProfile.deriveEncryptionKey(password);

    const profile = await UserProfile.loadFrom(db, encryptionKey);
    const signer = new MultiChainSigner(profile);
    const managerChains = await Persona.connectToAllConfiguredChains(signer);
    const manager = new AccountManager(profile, managerChains);

    return new Persona(encryptionKey, profile, signer, manager, makeAuthorizationCallbacks);
  }

  private static async connectToAllConfiguredChains(
    signer: MultiChainSigner,
  ): Promise<readonly AccountManagerChainConfig[]> {
    const config = await getConfigurationFile();

    const out: AccountManagerChainConfig[] = [];
    for (const chainSpec of config.chains.map(chain => chain.chainSpec)) {
      const codecType = codecTypeFromString(chainSpec.codecType);
      const connector = chainConnector(codecType, chainSpec.node, chainSpec.scraper);
      const { connection } = await signer.addChain(connector);
      out.push({
        chainId: connection.chainId(),
        algorithm: algorithmForCodec(codecType),
        derivePath: pathBuilderForCodec(codecType),
      });
    }

    return out;
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
    makeAuthorizationCallbacks: MakeAuthorizationCallbacks,
  ) {
    this.encryptionKey = encryptionKey;
    this.profile = profile;
    this.signer = signer;
    this.accountManager = accountManager;

    const { authorizeGetIdentities, authorizeSignAndPost } = makeAuthorizationCallbacks(signer);

    this.core = new SigningServerCore(
      this.profile,
      this.signer,
      authorizeGetIdentities,
      authorizeSignAndPost,
      console.error,
    );

    this.subscribeToTxUpdates(transactionsUpdater);
  }

  private subscribeToTxUpdates(notifyApp: (transactions: readonly ProcessedTx[]) => void): void {
    this.core.signedAndPosted.updates.subscribe({
      next: async signedAndPosted => {
        const processed = await Promise.all(signedAndPosted.map(s => this.processTransaction(s)));
        const filtered = processed.filter(isNonNull);
        notifyApp(filtered);
      },
    });
  }

  /**
   * We keep this async for now to allow fetching IOV names
   */
  private async processTransaction(t: SignedAndPosted): Promise<ProcessedTx | null> {
    if (!isSupportedTransaction(t.transaction)) {
      // cannot process
      return null;
    }

    const config: ConfigurationFile = await getConfigurationFile();
    const blockExplorer = config.blockExplorers[t.transaction.creator.chainId];
    const transactionId = t.postResponse.transactionId;
    const blockExplorerUrl = blockExplorer ? blockExplorer + transactionId : null;

    return {
      time: new ReadonlyDate(ReadonlyDate.now()).toLocaleString(),
      id: transactionId,
      signer: Encoding.toHex(t.transaction.creator.pubkey.data),
      blockExplorerUrl,
      error: null,
      original: t.transaction,
    };
  }

  public getCore(): SigningServerCore {
    return this.core;
  }

  public destroy(): void {
    this.signer.shutdown();
  }

  public async createAccount(db: StringDb): Promise<void> {
    await this.accountManager.generateNextAccount();
    await this.profile.storeIn(db, this.encryptionKey);
  }

  public async getAccounts(): Promise<readonly PersonaAcccount[]> {
    const accounts = await this.accountManager.accounts();

    const bnsConnection = this.getBnsConnection();

    return Promise.all(
      accounts.map(async (account, index) => {
        const bnsIdentity = account.identities.find(ident => ident.chainId === bnsConnection.chainId());
        if (!bnsIdentity) {
          throw new Error(`Missing BNS identity for account at index ${index}`);
        }

        let label: string;
        const names = await bnsConnection.getUsernames({ owner: this.signer.identityToAddress(bnsIdentity) });
        if (names.length > 1) {
          // this case will not happen for regular users that do not professionally collect username NFTs
          label = `Multiple names`;
        } else if (names.length === 1) {
          label = `${names[0].id}`;
        } else {
          label = `Account ${account.index}`;
        }

        return { label: label };
      }),
    );
  }

  public get mnemonic(): string {
    const wallets = this.profile.wallets.value;
    const mnemonics = new Set(wallets.map(info => this.profile.printableSecret(info.id)));

    if (mnemonics.size !== 1) {
      throw new Error("Found multiple different mnemoics in different wallets. This is not supported.");
    }

    return mnemonics.values().next().value;
  }

  public async getTxs(): Promise<readonly ProcessedTx[]> {
    const processed = await Promise.all(this.core.signedAndPosted.value.map(s => this.processTransaction(s)));
    const filtered = processed.filter(isNonNull);
    return filtered;
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
