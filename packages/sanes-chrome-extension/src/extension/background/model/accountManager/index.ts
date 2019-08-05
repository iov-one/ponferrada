import { Algorithm, ChainId, Identity, identityEquals } from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';
import { UserProfile, WalletId } from '@iov/keycontrol';
import { ReadonlyWallet } from '@iov/keycontrol';

export interface AccountInfo {
  readonly index: number;
  readonly identities: ReadonlyArray<Identity>;
}

export interface AccountManagerChainConfig {
  readonly chainId: ChainId;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
}

export class AccountManager {
  private readonly userProfile: UserProfile;
  private readonly chains: ReadonlyArray<AccountManagerChainConfig>;

  public constructor(userProfile: UserProfile, chains: ReadonlyArray<AccountManagerChainConfig>) {
    this.userProfile = userProfile;
    this.chains = chains;
  }

  public async generateNextAccount(): Promise<void> {
    const nextDerivation = await this.numberOfExistingAccounts();
    await this.generateAccount(nextDerivation);
  }

  /**
   * @returns a predefined names based on the derivation ie: account0, account1...
   */
  public async accounts(): Promise<ReadonlyArray<AccountInfo>> {
    const accountIndices = await this.existingAccountIndices();

    return accountIndices.map(accountIndex => {
      const identities = this.chains.map(chain => {
        const identitiesByChain = this.userProfile
          .getAllIdentities()
          .filter(ident => ident.chainId === chain.chainId);

        const identityByChainAndAccount = identitiesByChain.filter(
          ident => this.userProfile.getIdentityLabel(ident) === `${accountIndex}`,
        );

        if (identityByChainAndAccount.length !== 1) {
          throw new Error('Unexpected number of identities by chain and label');
        }
        return identityByChainAndAccount[0];
      });

      return {
        index: accountIndex,
        identities: identities,
      };
    });
  }

  /** This must be called with the next unused derivation index. Gaps are not supported. */
  private async generateAccount(derivation: number): Promise<void> {
    for (const chain of this.chains) {
      const { chainId, algorithm, derivePath } = chain;
      const path = derivePath(derivation);
      const wallet = this.walletForAlgorithm(algorithm);
      const identityCreated = await this.identityExistsInProfile(wallet, chainId, path);

      if (!identityCreated) {
        const identity = await this.userProfile.createIdentity(wallet, chainId, path);
        await this.userProfile.setIdentityLabel(identity, `${derivation}`);
      }
    }
  }

  private async existingAccountIndices(): Promise<ReadonlyArray<number>> {
    const existing: number = await this.numberOfExistingAccounts();
    return Array.from(Array(existing)).map((_, index) => index);
  }

  private async numberOfExistingAccounts(): Promise<number> {
    const firstChain = this.chains.find(() => true);
    if (!firstChain) {
      return 0;
    }
    const firstWallet = this.walletForAlgorithm(firstChain.algorithm);

    for (let i = 0; ; i++) {
      const path = firstChain.derivePath(i);
      const existsAccount = await this.identityExistsInProfile(firstWallet, firstChain.chainId, path);

      if (!existsAccount) {
        return i;
      }
    }
  }

  private walletForAlgorithm(algorithm: Algorithm): WalletId {
    const [edWallet, secpWallet] = this.userProfile.wallets.value.map(x => x.id);
    return algorithm === 'ed25519' ? edWallet : secpWallet;
  }

  private async identityExistsInProfile(
    walletId: WalletId,
    chainId: ChainId,
    path: ReadonlyArray<Slip10RawIndex>,
  ): Promise<boolean> {
    // FIXME iov-core, please.
    const wallet: ReadonlyWallet = (this.userProfile as any).findWalletInPrimaryKeyring(walletId);
    const ident = await wallet.previewIdentity(chainId, path);
    const allIdentities = wallet.getIdentities();
    return !!allIdentities.find(x => identityEquals(x, ident));
  }
}
