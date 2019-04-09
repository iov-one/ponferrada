import { Bip39, Random } from '@iov/crypto';
import {
  Ed25519HdWallet,
  Secp256k1HdWallet,
  UserProfile,
} from '@iov/keycontrol';

export async function createUserProfile(
  fixedMnemonic?: string
): Promise<UserProfile> {
  const entropyBytes = 16;
  const mnemonic =
    fixedMnemonic ||
    Bip39.encode(await Random.getBytes(entropyBytes)).asString();
  const edKeyring = Ed25519HdWallet.fromMnemonic(mnemonic);
  const secKeyring = Secp256k1HdWallet.fromMnemonic(mnemonic);
  const profile = new UserProfile();
  profile.addWallet(edKeyring);
  profile.addWallet(secKeyring);

  return profile;
}
