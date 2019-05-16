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
import { AccountManager, AccountManagerChainConfig } from './accountManager';
import { Encoding } from '@iov/encoding';

/** Like JsonRpcSigningServer but without functionality to create or shutdown */
export interface UseOnlyJsonRpcSigningServer {
  /**
   * Handles a request from a possibly untrusted source.
   *
   * 1. Parse request as a JSON-RPC request
   * 2. Convert JSON-RPC request into calls to SigningServerCore
   * 3. Call SigningServerCore
   * 4. Convert result to JSON-RPC response
   *
   * @param request The JSON-RPC request to be handled
   * @param meta An arbitrary object that is passed by reference into the autorization callbacks
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUnchecked(request: unknown, meta?: any): Promise<JsonRpcResponse>;
  /**
   * Handles a checked request, i.e. a request that is known to be a valid
   * JSON-RPC "Request object".
   *
   * 1. Convert JSON-RPC request into calls to SigningServerCore
   * 2. Call SigningServerCore
   * 3. Convert result to JSON-RPC response
   *
   * @param request The JSON-RPC request to be handled
   * @param meta An arbitrary object that is passed by reference into the autorization callbacks
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChecked(request: JsonRpcRequest, meta?: any): Promise<JsonRpcResponse>;
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

    // Setup initial account of index 0
    await manager.generateNextAccount();

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

  public async getAccounts(): Promise<ReadonlyArray<PersonaAcccount>> {
    const accounts = await this.accountManager.accounts();

    return accounts.map(account => {
      // TODO here: query network to get human readable address
      return {
        label: `Account ${account.index}`,
      };
    });
  }

  public async createAccount(): Promise<void> {
    await this.accountManager.generateNextAccount();
  }

  public async getTxs(): Promise<ReadonlyArray<ProcessedTx>> {
    if (!this.core) {
      return [];
    }

    const processed = await Promise.all(this.core.signedAndPosted.value.map(s => this.processTransaction(s)));
    const filtered = processed.filter(isNonNull);
    return filtered;
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
