import {
  Algorithm,
  ChainId,
  publicIdentityEquals,
  PublicIdentity,
} from '@iov/bcp';
import { UserProfile, WalletId } from '@iov/core';
import { EnhancedChainSpec } from '../blockchain/chainsConfig';
import { Slip10RawIndex } from '@iov/crypto';
import { ReadonlyWallet } from '@iov/keycontrol/types/wallet';

export interface AccountInfo {
  name: string;
  publicIdentities: ReadonlyMap<ChainId, PublicIdentity>;
}

export class Persona {
  private _userProfile: UserProfile;
  private _chains: EnhancedChainSpec[];

  public constructor(userProfile: UserProfile, chains: EnhancedChainSpec[]) {
    this._userProfile = userProfile;
    this._chains = chains;
  }

  public mnemonic(): string {
    const firstWalletId = this._userProfile.wallets.value[0].id;
    // all wallets use the same mnemonic, so we only need to check the first one
    const mnemonic = this._userProfile.printableSecret(firstWalletId);
    return mnemonic;
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
    const existing: number = await this.numberOfExistingAccounts();
    const accountIndices = Array.from(Array(existing)).map((_, index) => index);

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
        publicIdentities,
      };
    });
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
