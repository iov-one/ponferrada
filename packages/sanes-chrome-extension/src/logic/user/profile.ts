import { Bip39, Random } from '@iov/crypto';
import {
  Ed25519HdWallet,
  Secp256k1HdWallet,
  UserProfile,
} from '@iov/keycontrol';
import { createDb } from './db';
import { singleton } from '../../utils/singleton';

async function createUserProfile(fixedMnemonic?: string): Promise<UserProfile> {
  const EntropyBytes = 16;
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

const getDb = singleton<typeof createDb>(createDb);

/**
 * This function returns a UserProfile instance. Remember UserProfile and Persona are
 * the same concept. The difference UserProfile is closer to low-level blockchain capabilities.
 * UserProfile among others, stores wallets (private keys), identities (public keys) and mnemonic exposition.
 *
 * @param password Password introduced by user to hash the user profile
 * @param dbName
 * @returns UserProfile
 * @throws Custom exception if something has failed.
 */
export async function createProfile(
  password: string,
  dbName: string
): Promise<UserProfile> {
  let profile = undefined;
  try {
    const db = getDb(dbName);
    profile = await createUserProfile();
    await profile.storeIn(db, password);

    return profile;
  } catch (err) {
    console.log(err);

    throw new Error('Error creating a user profile');
  }
}
