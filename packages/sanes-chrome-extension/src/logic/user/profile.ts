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

export async function createProfile(
  password: string,
  dbName: string
): Promise<UserProfile> {
  const db = getDb(dbName);
  const profile = await createUserProfile();
  await profile.storeIn(db, password);

  return profile;
}
