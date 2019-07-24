import { Algorithm, ChainId, Identity, PubkeyBytes } from '@iov/bcp';
import { Ed25519, Random, Secp256k1 } from '@iov/crypto';
import { TransactionEncoder } from '@iov/encoding';

export async function createPubkeys(): Promise<{ [chain: string]: string }> {
  const keys: { [chain: string]: string } = {};

  // create ETH pub key
  const ethChain = 'ethereum-eip155-5777';
  const keypair = await Secp256k1.makeKeypair(await Random.getBytes(32));
  const ethIdentity: Identity = {
    chainId: ethChain as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: keypair.pubkey as PubkeyBytes,
    },
  };

  // get BNS pubkey
  const bnsChain = 'local-bns-devnet';
  const rawKeypair = await Ed25519.makeKeypair(await Random.getBytes(32));
  const bnsIdentity: Identity = {
    chainId: bnsChain as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: rawKeypair.pubkey as PubkeyBytes,
    },
  };

  keys[ethChain] = JSON.stringify(TransactionEncoder.toJson(ethIdentity));
  keys[bnsChain] = JSON.stringify(TransactionEncoder.toJson(bnsIdentity));

  return keys;
}
