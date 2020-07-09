import { Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Ed25519, Random, Secp256k1 } from "@iov/crypto";

export async function createIdentities(): Promise<readonly Identity[]> {
  const identities = new Array<Identity>();

  // create ETH pub key
  const ethChain = "ethereum-eip155-5777" as ChainId;
  const keypair = await Secp256k1.makeKeypair(await Random.getBytes(32));
  const ethIdentity: Identity = {
    chainId: ethChain,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: keypair.pubkey as PubkeyBytes,
    },
  };

  // get BNS pubkey
  const bnsChain = "local-iov-devnet" as ChainId;
  const rawKeypair = await Ed25519.makeKeypair(await Random.getBytes(32));
  const bnsIdentity: Identity = {
    chainId: bnsChain,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: rawKeypair.pubkey as PubkeyBytes,
    },
  };

  identities.push(ethIdentity);
  identities.push(bnsIdentity);

  return identities;
}
