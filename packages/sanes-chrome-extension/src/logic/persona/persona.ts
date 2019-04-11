import { Amount } from '@iov/bcp';
import { MultiChainSigner } from '@iov/core';

import { AccountsManager, AccountInfo } from '../user';

export class Persona {
  private readonly signer: MultiChainSigner;
  private readonly accountsManager: AccountsManager;

  /** The given signer and accountsManager must share the same UserProfile */
  public constructor(
    signer: MultiChainSigner,
    accountsManager: AccountsManager
  ) {
    this.signer = signer;
    this.accountsManager = accountsManager;
  }

  public mnemonic(): string {
    return this.accountsManager.mnemonic();
  }

  public async getAccounts(): Promise<ReadonlyArray<AccountInfo>> {
    return this.accountsManager.accounts();
  }

  public async getBalances(
    accountIndex: number
  ): Promise<ReadonlyArray<Amount>> {
    const account = (await this.accountsManager.accounts())[accountIndex];
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
}
