import { Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Ed25519, Random, Secp256k1 } from "@iov/crypto";

export async function createIdentities(): Promise<{ [chain: string]: Identity }> {
  const identities: { [chain: string]: Identity } = {};

  // create ETH pub key
  const ethChain = "ethereum-eip155-5777";
  const keypair = await Secp256k1.makeKeypair(await Random.getBytes(32));
  const ethIdentity: Identity = {
    chainId: ethChain as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: keypair.pubkey as PubkeyBytes,
    },
  };

  // get BNS pubkey
  const bnsChain = "local-iov-devnet";
  const rawKeypair = await Ed25519.makeKeypair(await Random.getBytes(32));
  const bnsIdentity: Identity = {
    chainId: bnsChain as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: rawKeypair.pubkey as PubkeyBytes,
    },
  };

  identities[ethChain] = ethIdentity;
  identities[bnsChain] = bnsIdentity;

  return identities;
}
