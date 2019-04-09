import { Algorithm, ChainId, publicIdentityEquals } from '@iov/bcp';
import { UserProfile, WalletId } from '@iov/core';
import { EnhancedChainSpec } from '../blockchain/chainsConfig';
import { Slip10RawIndex } from '@iov/crypto';
import { ReadonlyWallet } from '@iov/keycontrol/types/wallet';

class Persona {
  private _userProfile: UserProfile;
  private _chains: EnhancedChainSpec[];

  public constructor(userProfile: UserProfile, chains: EnhancedChainSpec[]) {
    this._userProfile = userProfile;
    this._chains = chains;
  }

  public async generateAccount(derivation: number): Promise<void> {
    for (const chain of this._chains) {
      const { chainId, algorithm, derivePath, encoder } = chain;
      const path = derivePath(derivation);
      const wallet = this.walletForAlgorithm(algorithm);
      const identityCreated = await this.identityExistsInProfile(
        wallet,
        chainId,
        path
      );

      if (!identityCreated) {
        await this._userProfile.createIdentity(wallet, chainId, path);
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
  public async accounts(): Promise<string[]> {
    const totalAccounts: number = await this.numberOfExistingAccounts();

    return Array.from(Array(totalAccounts)).map(
      (_, index) => `Account ${index}`
    );
  }

  private async numberOfExistingAccounts(): Promise<number> {
    const firstChain = this._chains[0];
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

export default Persona;
