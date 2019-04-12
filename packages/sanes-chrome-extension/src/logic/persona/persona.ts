import { Amount } from '@iov/bcp';
import { MultiChainSigner } from '@iov/core';

import { createUserProfile } from '../user';
import {
  chainConnector,
  getConfigurationFile,
  codecTypeFromString,
  algorithmForCodec,
  pathBuilderForCodec,
} from '../config';
import {
  AccountManager,
  AccountInfo,
  AccountManagerChainConfig,
} from './accountmanager';

export class Persona {
  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async create(): Promise<Persona> {
    const config = await getConfigurationFile();

    const profile = await createUserProfile();
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

    return new Persona(signer, manager);
  }

  private readonly signer: MultiChainSigner;
  private readonly accountManager: AccountManager;

  /** The given signer and accountsManager must share the same UserProfile */
  private constructor(
    signer: MultiChainSigner,
    accountManager: AccountManager
  ) {
    this.signer = signer;
    this.accountManager = accountManager;
  }

  public mnemonic(): string {
    return this.accountManager.mnemonic();
  }

  public async getAccounts(): Promise<ReadonlyArray<AccountInfo>> {
    return this.accountManager.accounts();
  }

  public async getBalances(
    accountIndex: number
  ): Promise<ReadonlyArray<Amount>> {
    const account = (await this.accountManager.accounts())[accountIndex];
    const identities = [...account.identities.values()];
    const pendingAccountResults = identities.map(identity => {
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

  public destroy(): void {
    this.signer.shutdown();
  }
}
