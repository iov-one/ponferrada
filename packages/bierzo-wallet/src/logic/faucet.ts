import { Identity, TokenTicker, TxCodec } from '@iov/bcp';
import { bnsCodec } from '@iov/bns';
import { TransactionEncoder } from '@iov/core';
import { ethereumCodec } from '@iov/ethereum';
import { IovFaucet } from '@iov/faucets';
import { liskCodec } from '@iov/lisk';

import { ChainSpec, getConfig } from '../config';
import { BwToken } from '../store/tokens';
import { getConnectionFor, isBnsSpec, isEthSpec, isLskSpec } from './connection';

function getCodec(spec: ChainSpec): TxCodec {
  if (isEthSpec(spec)) {
    return ethereumCodec;
  }

  if (isBnsSpec(spec)) {
    return bnsCodec;
  }

  if (isLskSpec(spec)) {
    return liskCodec;
  }

  throw new Error('Unsupported codecType for chain spec');
}

function getTokensByChainId(chainId: string, tokens: { [ticker: string]: BwToken }): ReadonlyArray<string> {
  return Object.entries(tokens).reduce((filteredTokens: ReadonlyArray<string>, pair) => {
    const [key, value] = pair;
    return value.chainId === chainId ? [...filteredTokens, key] : filteredTokens;
  }, []);
}

export async function drinkFaucetIfNeeded(
  keys: { [chain: string]: string },
  tokens: { [ticker: string]: BwToken },
): Promise<void> {
  const config = getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    const faucetSpec = chain.faucetSpec;
    if (!faucetSpec) {
      continue;
    }

    const codec = getCodec(chain.chainSpec);
    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId() as string;
    const tokensByChainId = getTokensByChainId(chainId, tokens);
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
    const faucet = new IovFaucet(faucetSpec.uri);
    const address = codec.identityToAddress(identity);

    for (const token of tokensByChainId) {
      try {
        await faucet.credit(address, token as TokenTicker);
      } catch (err) {
        console.log(`Error using faucet for ${chainId}: ${err.message}`);
      }
    }
  }
}
