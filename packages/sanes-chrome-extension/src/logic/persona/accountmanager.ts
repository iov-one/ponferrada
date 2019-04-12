import {
  Algorithm,
  ChainId,
  publicIdentityEquals,
  PublicIdentity,
} from '@iov/bcp';
import { UserProfile, WalletId } from '@iov/core';
import { Slip10RawIndex } from '@iov/crypto';
import { ReadonlyWallet } from '@iov/keycontrol/types/wallet';

export interface AccountInfo {
  readonly name: string;
  readonly identities: ReadonlyMap<ChainId, PublicIdentity>;
}

export interface AccountManagerChainConfig {
  readonly chainId: ChainId;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
}

export class AccountManager {
  private readonly _userProfile: UserProfile;
  private readonly _chains: ReadonlyArray<AccountManagerChainConfig>;

  public constructor(
    userProfile: UserProfile,
    chains: ReadonlyArray<AccountManagerChainConfig>
  ) {
    this._userProfile = userProfile;
    this._chains = chains;
  }

  public async generateAccount(derivation: number): Promise<void> {
    for (const chain of this._chains) {
      const { chainId, algorithm, derivePath } = chain;
      const path = derivePath(derivation);
      const wallet = this.walletForAlgorithm(algorithm);
      const identityCreated = await this.identityExistsInProfile(
        wallet,
        chainId,
        path
      );

      if (!identityCreated) {
        const identity = await this._userProfile.createIdentity(
          wallet,
          chainId,
          path
        );
        await this._userProfile.setIdentityLabel(identity, `${derivation}`);
      }
    }
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

    return accountIndices.map(index => {
      const publicIdentities = new Map(
        this._chains.map(chain => {
          const identitiesByChain = this._userProfile
            .getAllIdentities()
            .filter(ident => ident.chainId === chain.chainId);

          const identityByLabel = identitiesByChain.filter(
            ident => this._userProfile.getIdentityLabel(ident) === `${index}`
          );

          if (identityByLabel.length !== 1) {
            throw new Error(
              'Unexpected number of identities by chain and label'
            );
          }

          return [chain.chainId, identityByLabel[0]];
        })
      );

      return {
        name: `Account ${index}`,
        identities: publicIdentities,
      };
    });
  }

  private async existingAccountIndices(): Promise<ReadonlyArray<number>> {
    const existing: number = await this.numberOfExistingAccounts();
    return Array.from(Array(existing)).map((_, index) => index);
  }

  private async numberOfExistingAccounts(): Promise<number> {
    const firstChain = this._chains.find(() => true);
    if (!firstChain) {
      return 0;
    }
    const firstWallet = this.walletForAlgorithm(firstChain.algorithm);

    for (let i = 0; ; i++) {
      const path = firstChain.derivePath(i);
      const existsAccount = await this.identityExistsInProfile(
        firstWallet,
        firstChain.chainId,
        path
      );

      if (!existsAccount) {
        return i;
      }
    }
  }

  private walletForAlgorithm(algorithm: Algorithm): WalletId {
    const [edWallet, secpWallet] = this._userProfile.wallets.value.map(
      x => x.id
    );
    return algorithm === 'ed25519' ? edWallet : secpWallet;
  }

  private async identityExistsInProfile(
    walletId: WalletId,
    chainId: ChainId,
    path: ReadonlyArray<Slip10RawIndex>
  ): Promise<boolean> {
    // FIXME iov-core, please.
    const wallet: ReadonlyWallet = (this
      ._userProfile as any).findWalletInPrimaryKeyring(walletId); // eslint-disable-line @typescript-eslint/no-explicit-any
    const ident = await wallet.previewIdentity(chainId, path);
    const allIdentities = wallet.getIdentities();
    return !!allIdentities.find(x => publicIdentityEquals(x, ident));
  }
}
