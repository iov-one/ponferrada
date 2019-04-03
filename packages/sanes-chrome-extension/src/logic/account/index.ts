import {
  ChainId,
  TxReadCodec,
  PublicIdentity,
  Address,
  publicIdentityEquals,
} from '@iov/bcp';
import { Slip10RawIndex } from '@iov/crypto';
import { UserProfile, WalletId } from '@iov/keycontrol';

import { CodecType } from '../blockchain/connection';
import { ReadonlyWallet } from '@iov/keycontrol/types/wallet';
import { EditorFormatUnderlined } from 'material-ui/svg-icons';

export type Algorithm = 'secp256k1' | 'ed25519';

export interface ChainDerivation {
  readonly chainId: ChainId;
  readonly algorithm: Algorithm;
  readonly derivePath: (account: number) => ReadonlyArray<Slip10RawIndex>;
  readonly encoder: TxReadCodec;
}

export type DerivationInfo = ReadonlyArray<ChainDerivation>;

// AccountInfo contains all context for a properly derived account
export interface AccountInfo {
  readonly chainId: ChainId;
  readonly algorithm: Algorithm;
  readonly derivation: number;
  readonly path: ReadonlyArray<Slip10RawIndex>;
  readonly identity: PublicIdentity;
  readonly address: Address;
}

// MissingAccountInfo is returned when no such account is registered
export interface MissingAccountInfo {
  readonly chainId: ChainId;
  readonly derivation: number;
  readonly missing: true;
}

export const isMissingAccount = (
  info: MaybeAccountInfo
): info is MissingAccountInfo => (info as MissingAccountInfo).missing === true;

export type MaybeAccountInfo = AccountInfo | MissingAccountInfo;

// Account stores all info for one derivation (eg. 5)
// All info on associated chains, and possibly a name (TODO: how to store)
export interface Account<T extends MaybeAccountInfo = MaybeAccountInfo> {
  readonly derivation: number;
  readonly name?: string;
  readonly chains: ReadonlyArray<T>;
}

// ProfileWithAccounts will use the derivation info to provide context around an account
export class ProfileWithAccounts {
  private _derivationInfo: DerivationInfo;
  public readonly profile: UserProfile;

  constructor(profile: UserProfile, derivationInfo: DerivationInfo) {
    this._derivationInfo = derivationInfo;
    this.profile = profile;
  }

  // loadAccount will check for the account corresponding to the given derivation on all chains registered
  // in the constructor. If at least one chain has a derived account, it will return an array with one element
  // per registered chain (present or missing). If no chains have an account for that derivation,
  // it will return undefined
  public async loadAccount(derivation: number): Promise<Account | undefined> {
    const chains = await Promise.all(
      this._derivationInfo.map(info => this.loadChainAccount(info, derivation))
    );
    // make it obvious when no info is present
    if (chains.every(isMissingAccount)) {
      return undefined;
    }
    // TODO: how to handle names?
    return {
      derivation,
      chains,
    };
  }

  // ensureAccount will check for any accounts with the given derivation, and create those which are missing.
  // It will use the name if provided.
  public async ensureAccount(
    derivation: number,
    name?: string
  ): Promise<Account<AccountInfo>> {
    const existing = await this.loadAccount(derivation);
    if (!existing) {
      // nothing here, we generate them all
      const chains = await Promise.all(
        this._derivationInfo.map(info =>
          this.createChainAccount(info, derivation)
        )
      );
      return { derivation, chains, name };
    }

    // otherwise, we fill in the blanks, if any
    const chains = await Promise.all(
      existing.chains.map(async maybe => {
        if (!isMissingAccount(maybe)) {
          return maybe;
        }
        const info = this._derivationInfo.find(x => x.chainId == maybe.chainId);
        return this.createChainAccount(info!, maybe.derivation);
      })
    );

    return { derivation, chains, name };
  }

  // loadAllAccounts will iterate over derivations (1, 2... N) until there is an iteration
  // with no accounts found. This should return all stored keys created by this class
  public async loadAllAccounts(): Promise<ReadonlyArray<Account>> {
    let result: ReadonlyArray<Account> = [];
    let derivation = 1;
    while (true) {
      const account = await this.loadAccount(derivation);
      if (!account) {
        return result;
      }
      result = [...result, account];
    }
  }

  // ensureAllAccounts will load all accounts that have stored a key for at least one chain
  // and ensure they have keys for all chains
  public async ensureAllAccounts(): Promise<
    ReadonlyArray<Account<AccountInfo>>
  > {
    const maybeAccounts = await this.loadAllAccounts();
    return Promise.all(
      maybeAccounts.map(maybe =>
        this.ensureAccount(maybe.derivation, maybe.name)
      )
    );
  }

  // createChainAccount will create the new key based on the derivation.
  // if it already exists it will throw an error (so check first)!
  private async createChainAccount(
    info: ChainDerivation,
    derivation: number
  ): Promise<AccountInfo> {
    const { chainId, algorithm, derivePath, encoder } = info;
    const path = derivePath(derivation);
    const wallet = this.walletForAlgorithm(algorithm);
    const identity = await this.profile.createIdentity(wallet, chainId, path);
    return {
      chainId,
      algorithm,
      derivation,
      path,
      identity,
      address: encoder.identityToAddress(identity),
    };
  }

  // loadChainAccount will check for account (there or missing) for one chain and derivation
  private async loadChainAccount(
    info: ChainDerivation,
    derivation: number
  ): Promise<MaybeAccountInfo> {
    const { chainId, algorithm, derivePath, encoder } = info;
    const path = derivePath(derivation);
    const wallet = this.walletForAlgorithm(algorithm);
    const identity = await this.checkPathExists(wallet, chainId, path);
    if (identity === undefined) {
      return {
        chainId,
        derivation,
        missing: true,
      };
    }
    return {
      chainId,
      algorithm,
      derivation,
      path,
      identity,
      address: encoder.identityToAddress(identity),
    };
  }

  private walletForAlgorithm(algorithm: Algorithm): WalletId {
    const [edWallet, secpWallet] = this.profile.wallets.value.map(x => x.id);
    return algorithm === 'ed25519' ? edWallet : secpWallet;
  }

  /*
  we really need a
  public async checkIdentity(
    walletId: WalletId,
    chainId: ChainId,
    options: Ed25519Keypair | ReadonlyArray<Slip10RawIndex> | number,
  ): Promise<PublicIdentity>|undefined {
    // returns the corresponding public identity if there already
  }
*/

  // FIXME
  // this is an ugly hack... this really needs to be added to the root UserProfile API
  private async checkPathExists(
    walletId: WalletId,
    chainId: ChainId,
    path: ReadonlyArray<Slip10RawIndex>
  ): Promise<PublicIdentity | undefined> {
    // Breaking encapsulation... bad Ethan
    const wallet: ReadonlyWallet = (this
      .profile as any).findWalletInPrimaryKeyring(walletId);
    const ident = await wallet.previewIdentity(chainId, path);
    const allIdentities = wallet.getIdentities();
    return allIdentities.find(x => publicIdentityEquals(x, ident));
  }
}

// const addAccount = async (
//   profile: UserProfile,
//   chainInfo: ChainDerivation,
//   derivation: number
// ): Promise<AccountInfo> => {
//   const { chainId, algorithm, derivePath, encoder } = chainInfo;
//   const path = derivePath(derivation);
//   const identity: PublicIdentity = await profile.createIdentity(
//     this.walletForAlgorithm(algorithm),
//     chainId,
//     path
//   );
//   const address = encoder.identityToAddress(identity);
//   return { chainId, algorithm, derivation, path, identity, address };
// };

// export const addAccounts = (
//   profile: UserProfile,
//   info: DerivationInfo,
//   derivation: number
// ): Promise<ReadonlyArray<AccountInfo>> =>
//   Promise.all(
//     info.map(chainInfo => addAccount(profile, chainInfo, derivation))
//   );
