import { ChainId, PublicIdentity } from '@iov/bcp-types';
import { Bip39, Random, Slip10RawIndex } from '@iov/crypto';
import {
  Ed25519HdWallet,
  HdPaths,
  Secp256k1HdWallet,
  UserProfile,
  WalletId,
} from '@iov/keycontrol';

import { hasDbKey, StringDB } from '../../db';

const EntropyBytes = 16;

// initializes a UserProfile with two keyrings (ed25519, secp256k1)
// you can pass in a mnemonic or it will generate a random one, same will be used for both
// you must then make chain-specific identities in ensureIdentity
export async function createProfile(
  fixedMnemonic?: string
): Promise<UserProfile> {
  const mnemonic =
    fixedMnemonic ||
    Bip39.encode(await Random.getBytes(EntropyBytes)).asString();
  const edKeyring = Ed25519HdWallet.fromMnemonic(mnemonic);
  const secKeyring = Secp256k1HdWallet.fromMnemonic(mnemonic);
  const profile = new UserProfile();
  profile.addWallet(edKeyring);
  profile.addWallet(secKeyring);
  return profile;
}

// TODO: save this when creating (need password, etc)
export async function ensureIdentity(
  profile: UserProfile,
  chainId: ChainId,
  codecType: string
): Promise<PublicIdentity> {
  const { walletId, path } = selectWalletAndPath(profile, codecType);
  // return existing identity if it exists
  const existing = profile
    .getIdentities(walletId)
    .find(i => i.chainId === chainId);
  if (existing) {
    return existing;
  }
  // otherwise, create the proper identity
  return profile.createIdentity(walletId, chainId, path);
}

function selectWalletAndPath(
  profile: UserProfile,
  codecType: string
): {
  readonly walletId: WalletId;
  readonly path: ReadonlyArray<Slip10RawIndex>;
} {
  // assumes there are two wallets set up, let's enfor
  const wallets = profile.wallets.value.map(i => i.id);
  if (wallets.length !== 2) {
    throw new Error('Wallet not properly set up');
  }
  const [edWallet, secWallet] = wallets;
  switch (codecType) {
    case 'bns':
      return { walletId: edWallet, path: HdPaths.iov(0) };
    case 'bov':
      return { walletId: edWallet, path: HdPaths.iov(1) };
    case 'lsk':
      return { walletId: edWallet, path: HdPaths.bip44Like(134, 0) };
    case 'eth':
      return { walletId: secWallet, path: HdPaths.metamaskHdKeyTree(0) };
    default:
      throw new Error(`unsupported codec: ${codecType}`);
  }
}

export interface WalletAndIdentity {
  readonly walletId: WalletId;
  readonly identity: PublicIdentity;
}

// searches all wallets to find an identity matching this chain
// returns the first one, assuming it is unique (currently true, see ensureIdentity)
// throws an error if this doesn't exist
export function getWalletAndIdentity(
  profile: UserProfile,
  chainId: ChainId
): WalletAndIdentity {
  const wallets = profile.wallets.value.map(i => i.id);
  for (const walletId of wallets) {
    const identity = profile
      .getIdentities(walletId)
      .find(i => i.chainId === chainId);
    if (identity !== undefined) {
      return { walletId, identity };
    }
  }
  throw new Error(`No identity found for chain: ${chainId}`);
}

// getIdentity is just a wrapper around getWalletAndIdentity to avoid lots of typing on usage
export function getIdentity(
  profile: UserProfile,
  chainId: ChainId
): PublicIdentity {
  return getWalletAndIdentity(profile, chainId).identity;
}

// returns true if there is a profile to load
export async function hasStoredProfile(db: StringDB): Promise<boolean> {
  // copied from userProfile.ts.... there should be a cleaner way
  const storageKeyCreatedAt = 'created_at';
  const storageKeyKeyring = 'keyring';
  return (
    (await hasDbKey(db, storageKeyCreatedAt)) && hasDbKey(db, storageKeyKeyring)
  );
}

// loads the profile if possible, otherwise creates a new one and saves it
// throws an error on existing profile, but bad password
// if mnemonic is provided, it will create new one from that mnemonic, overwriting anything that exists
export async function loadOrCreateProfile(
  db: StringDB,
  password: string,
  mnemonic?: string
): Promise<UserProfile> {
  // exisiting db with simple password will trigger load
  if ((await hasStoredProfile(db)) && !mnemonic) {
    return loadProfile(db, password);
  }
  // provided mnemonic or db missing will trigger reset
  return resetProfile(db, password, mnemonic);
}

// creates new profile with random seed, or existing mnemonic if provided
export async function resetProfile(
  db: StringDB,
  password: string,
  mnemonic?: string
): Promise<UserProfile> {
  const profile = await createProfile(mnemonic);
  await profile.storeIn(db, password);
  return profile;
}

export async function loadProfile(
  db: StringDB,
  password: string
): Promise<UserProfile> {
  try {
    const res = await UserProfile.loadFrom(db, password);
    return res;
  } catch (err) {
    // TODO: rethink how we handle this, this is a bit dangerous as is, but there
    // is no recovery path yet. From iov-core 0.8.0, there should be auto-migration
    console.log('Invalid password or invalid format of current DB');
    console.log('If the password is correct, try resetProfile...');
    throw err;
  }
}

// this normalizes white-space and makes everything lower-case, so two mnemonics that look the same
// to a human also look the same to a machine
export function cleanMnemonic(mnemonic: string): string {
  const base = mnemonic.toLowerCase().trim();
  // collapse any whitespace between words into a simple space
  return base.replace(/\s+/g, ' ');
}
