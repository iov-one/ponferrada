import { Algorithm, ChainId } from "@iov/bcp";
import { Slip10RawIndex } from "@iov/crypto";
import { UserProfile } from "@iov/keycontrol";

import { createTwoWalletProfile } from "./userprofilehelpers";

describe("userprofilehelpers", () => {
  describe("createTwoWalletProfile", () => {
    it("creates profile with Ed25519 and Secp256k1 wallets", async () => {
      const mnemonic = "sight welcome change quality permit urban spend husband naive abuse slogan trumpet";
      const profile = createTwoWalletProfile(mnemonic);

      // Test basic structure
      expect(profile).toBeInstanceOf(UserProfile);
      expect(profile.wallets.value.length).toEqual(2);

      // Test for correct mnemonic
      const [wallet1, wallet2] = profile.wallets.value.map(wallet => wallet.id);
      expect(profile.printableSecret(wallet1)).toEqual(mnemonic);
      expect(profile.printableSecret(wallet2)).toEqual(mnemonic);

      // Test that first wallet is Ed25519 and second one Secp256k1
      const chain = "local-foobar" as ChainId;
      const path = [Slip10RawIndex.hardened(1), Slip10RawIndex.hardened(2)];
      expect((await profile.createIdentity(wallet1, chain, path)).pubkey.algo).toEqual(Algorithm.Ed25519);
      expect((await profile.createIdentity(wallet2, chain, path)).pubkey.algo).toEqual(Algorithm.Secp256k1);
    });
  });
});
