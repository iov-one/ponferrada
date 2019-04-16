import { Ed25519HdWallet, Secp256k1HdWallet, UserProfile } from '@iov/keycontrol';

export async function createUserProfile(mnemonic: string): Promise<UserProfile> {
  const edKeyring = Ed25519HdWallet.fromMnemonic(mnemonic);
  const secKeyring = Secp256k1HdWallet.fromMnemonic(mnemonic);
  const profile = new UserProfile();
  profile.addWallet(edKeyring);
  profile.addWallet(secKeyring);

  return profile;
}
