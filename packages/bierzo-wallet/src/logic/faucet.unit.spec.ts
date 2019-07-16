import { Algorithm, ChainId, Identity, PubkeyBytes, TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { Ed25519, Random, Secp256k1 } from '@iov/crypto';

import { getBalances } from '../store/balances';
import { BwToken } from '../store/tokens';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { disconnect } from './connection';
import { drinkFaucetIfNeeded } from './faucet';

const tokens: { [ticker: string]: BwToken } = {
  ETH: {
    chainId: 'ethereum-eip155-5777' as ChainId,
    token: {
      fractionalDigits: 18,
      tokenName: 'Ether',
      tokenTicker: 'ETH' as TokenTicker,
    },
  },
  ASH: {
    chainId: 'local-bns-devnet' as ChainId,
    token: {
      fractionalDigits: 9,
      tokenName: 'Let the Phoenix arise',
      tokenTicker: 'ASH' as TokenTicker,
    },
  },
  BASH: {
    chainId: 'local-bns-devnet' as ChainId,
    token: {
      fractionalDigits: 9,
      tokenName: 'Another token of this chain',
      tokenTicker: 'BASH' as TokenTicker,
    },
  },
  CASH: {
    chainId: 'local-bns-devnet' as ChainId,
    token: {
      fractionalDigits: 9,
      tokenName: 'Main token of this chain',
      tokenTicker: 'CASH' as TokenTicker,
    },
  },
  LSK: {
    chainId: 'lisk-198f2b61a8' as ChainId,
    token: {
      fractionalDigits: 8,
      tokenName: 'Lisk',
      tokenTicker: 'LSK' as TokenTicker,
    },
  },
};

async function createPubkeys(): Promise<{ [chain: string]: string }> {
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

withChainsDescribe('Logic :: faucet', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('works', async () => {
    // generate keys
    const keys = await createPubkeys();
    // check their balance are 0
    const initialBalances = await getBalances(keys);
    expect(initialBalances).toEqual({});
    // drink faucet
    await drinkFaucetIfNeeded(keys, tokens);
    // check their balances
    const balances = await getBalances(keys);
    expect(balances).toEqual({
      BASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'BASH',
      },
      CASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'CASH',
      },
      ETH: {
        fractionalDigits: 18,
        quantity: '10000000000000000000',
        tokenTicker: 'ETH',
      },
    });
  }, 15000);
});
