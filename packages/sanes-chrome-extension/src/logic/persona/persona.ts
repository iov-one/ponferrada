/*global chrome*/
import { ReadonlyDate } from 'readonly-date';

import { Amount, PublicIdentity } from '@iov/bcp';
import {
  MultiChainSigner,
  UserProfile,
  SigningServerCore,
  SignAndPostAuthorization,
  GetIdentitiesAuthorization,
  JsonRpcSigningServer,
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
import { isNewSender } from './personaWhitelist';

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

export interface TxProps {
  readonly id: string;
  readonly recipient: string;
  readonly signer: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface ProcessedTx extends TxProps {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly success: boolean;
  readonly err?: any; // eslint-disable-line
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

  // TODO implement
  public async getTxs(): Promise<ReadonlyArray<ProcessedTx>> {
    return [];
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

  public startSigningServer(): UseOnlyJsonRpcSigningServer {
    const revealAllIdentities: GetIdentitiesAuthorization = async (
      reason,
      matchingIdentities
    ): Promise<ReadonlyArray<PublicIdentity>> => {
      if (isNewSender('http://finnex.com')) {
        chrome.browserAction.setIcon({ path: 'assets/icons/request128.png' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
        chrome.browserAction.setBadgeText({ text: '*' });
      }

      return matchingIdentities;
    };
    const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
      return true;
    };

    const core = new SigningServerCore(this.profile, this.signer, revealAllIdentities, signEverything);
    const server = new JsonRpcSigningServer(core);
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
}
