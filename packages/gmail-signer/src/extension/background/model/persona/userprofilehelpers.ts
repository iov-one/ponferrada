import { Ed25519HdWallet, Secp256k1HdWallet, UserProfile } from "@iov/keycontrol";

export function createTwoWalletProfile(mnemonic: string): UserProfile {
  const edWallet = Ed25519HdWallet.fromMnemonic(mnemonic);
  const secpWallet = Secp256k1HdWallet.fromMnemonic(mnemonic);

  const profile = new UserProfile();
  profile.addWallet(edWallet);
  profile.addWallet(secpWallet);
  return profile;
}
