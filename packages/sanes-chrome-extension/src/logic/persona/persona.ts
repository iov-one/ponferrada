import { Amount } from '@iov/bcp';
import { MultiChainSigner } from '@iov/core';

import { AccountManager, AccountInfo, createUserProfile } from '../user';
import { chainConnector, getRuntimeConfiguration } from '../config';

export class Persona {
  /**
   * Creates a new Persona instance.
   *
   * This function does everything that cannot be done in a constructor
   * (because a constructor is synchonous): reading configs, connecting to the network,
   * creating accounts.
   */
  public static async create(): Promise<Persona> {
    const { chains } = await getRuntimeConfiguration();

    const profile = await createUserProfile();
    const signer = new MultiChainSigner(profile);

    // connect chains
    for (const chain of chains) {
      const connector = chainConnector(chain.codecType, chain.bootstrapNodes);
      signer.addChain(connector);
    }

    const manager = new AccountManager(profile, chains);

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
