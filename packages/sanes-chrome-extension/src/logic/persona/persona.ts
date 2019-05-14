import { ReadonlyDate } from 'readonly-date';

import { Amount, isSendTransaction } from '@iov/bcp';
import {
  MultiChainSigner,
  UserProfile,
  SigningServerCore,
  SignAndPostAuthorization,
  GetIdentitiesAuthorization,
  JsonRpcSigningServer,
  SignedAndPosted,
} from '@iov/core';
import { Bip39, Random } from '@iov/crypto';
import { JsonRpcResponse, JsonRpcRequest } from '@iov/jsonrpc';

import { createUserProfile } from '../user';
import {
  chainConnector,
  getConfigurationFile,
  codecTypeFromString,
  algorithmForCodec,
  pathBuilderForCodec,
} from '../config';
import { AccountManager, AccountInfo, AccountManagerChainConfig } from './accountManager';
import { Encoding } from '@iov/encoding';

/** Like UseOnlyJsonRpcSigningServer but without functionality to create or shutdown */
export interface UseOnlyJsonRpcSigningServer {
  handleUnchecked(request: unknown): Promise<JsonRpcResponse>;
  /**
   * Handles a checked JsRpcRequest
   *
   * 1. convert JsRpcRequest into calls to SigningServerCore
   * 2. call SigningServerCore
   * 3. convert result to JS RPC format
   */
  handleChecked(request: JsonRpcRequest): Promise<JsonRpcResponse>;
}

/**
 * A transaction signed by the user of the extension.
 *
 * All fields must be losslessly JSON serializable/deserializable to allow
 * messaging between background script and UI.
 */
export interface ProcessedTx {
  readonly id: string;
  readonly recipient: string;
  readonly signer: string;
  readonly amount: Amount;
  readonly memo?: string;
  readonly time: string;
  /** If error is null, the transactin succeeded  */
  readonly error: string | null;
}

function isNonNull<T>(t: T | null): t is T {
  return t !== null;
}

export class Persona {
  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async create(fixedMnemonic?: string): Promise<Persona> {
    const config = await getConfigurationFile();

    const entropyBytes = 16;
    const mnemonic = fixedMnemonic || Bip39.encode(await Random.getBytes(entropyBytes)).asString();
    const profile = await createUserProfile(mnemonic);
    const signer = new MultiChainSigner(profile);

    // connect chains
    const managerChains: AccountManagerChainConfig[] = [];
    for (const chainSpec of config.chains.map(chain => chain.chainSpec)) {
      const codecType = codecTypeFromString(chainSpec.codecType);
      const connector = chainConnector(codecType, chainSpec.bootstrapNodes);
      const { connection } = await signer.addChain(connector);
      managerChains.push({
        chainId: connection.chainId(),
        algorithm: algorithmForCodec(codecType),
        derivePath: pathBuilderForCodec(codecType),
      });
    }

    const manager = new AccountManager(profile, managerChains);

    // Setup accounts
    await manager.generateAccount(0);

    return new Persona(profile, signer, manager);
  }

  private readonly profile: UserProfile;
  private readonly signer: MultiChainSigner;
  private readonly accountManager: AccountManager;
  private core: SigningServerCore | undefined;
  private signingServer: JsonRpcSigningServer | undefined;

  /** The given signer and accountsManager must share the same UserProfile */
  private constructor(profile: UserProfile, signer: MultiChainSigner, accountManager: AccountManager) {
    this.profile = profile;
    this.signer = signer;
    this.accountManager = accountManager;
  }

  public get mnemonic(): string {
    const wallets = this.profile.wallets.value;
    const mnemonics = new Set(wallets.map(info => this.profile.printableSecret(info.id)));

    if (mnemonics.size !== 1) {
      throw new Error('Found multiple different mnemoics in different wallets. This is not supported.');
    }

    return mnemonics.values().next().value;
  }

  public async getAccounts(): Promise<ReadonlyArray<AccountInfo>> {
    return this.accountManager.accounts();
  }

  public async getTxs(): Promise<ReadonlyArray<ProcessedTx>> {
    if (!this.core) {
      return [];
    }

    const processed = await Promise.all(this.core.signedAndPosted.value.map(s => this.processTransaction(s)));
    const filtered = processed.filter(isNonNull);
    return filtered;
  }

  public async getBalances(accountIndex: number): Promise<ReadonlyArray<Amount>> {
    const accounts = await this.accountManager.accounts();
    if (accounts.length <= accountIndex) {
      throw new Error('Account does not exist');
    }
    const account = accounts[accountIndex];
    const pendingAccountResults = account.identities.map(identity => {
      const { chainId, pubkey } = identity;
      return this.signer.connection(chainId).getAccount({ pubkey });
    });
    const accountResults = await Promise.all(pendingAccountResults);

    const out: Amount[] = [];
    for (const result of accountResults) {
      if (result) {
        out.push(...result.balance);
      }
    }
    return out;
  }

  public startSigningServer(
    authorizeGetIdentities: GetIdentitiesAuthorization,
    authorizeSignAndPost: SignAndPostAuthorization,
    transactionsChanged?: (transactions: ReadonlyArray<ProcessedTx>) => void,
  ): UseOnlyJsonRpcSigningServer {
    const core = new SigningServerCore(
      this.profile,
      this.signer,
      authorizeGetIdentities,
      authorizeSignAndPost,
    );

    if (transactionsChanged) {
      core.signedAndPosted.updates.subscribe({
        next: async signedAndPosed => {
          const processed = await Promise.all(signedAndPosed.map(s => this.processTransaction(s)));
          const filtered = processed.filter(isNonNull);
          transactionsChanged(filtered);
        },
      });
    }

    const server = new JsonRpcSigningServer(core);
    this.core = core;
    this.signingServer = server;
    return server;
  }

  public tearDownSigningServer(): void {
    if (this.signingServer) {
      this.signingServer.shutdown();
      this.signingServer = undefined;
    }
  }

  public destroy(): void {
    this.tearDownSigningServer();
    this.signer.shutdown();
  }

  /**
   * We keep this async for now to allow fetching IOV names
   */
  private async processTransaction(t: SignedAndPosted): Promise<ProcessedTx | null> {
    if (!isSendTransaction(t.transaction)) {
      // cannot process
      return null;
    }

    return {
      time: new ReadonlyDate(ReadonlyDate.now()).toLocaleString(),
      id: t.postResponse.transactionId,
      recipient: t.transaction.recipient,
      signer: Encoding.toHex(t.transaction.creator.pubkey.data),
      memo: t.transaction.memo,
      amount: t.transaction.amount,
      error: null,
    };
  }
}
