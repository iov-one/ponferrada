import { BlockchainConnection } from '@iov/bcp';
import { BnsConnection } from '@iov/bns';
import { EthereumConnection } from '@iov/ethereum';
import { LiskConnection } from '@iov/lisk';

import { ChainSpec, loadConfig } from '../../utils/config';
import { AddTickerActionType, BwToken } from './reducer';

async function createConnectionFor(spec: ChainSpec): Promise<BlockchainConnection | null> {
  const url = spec.bootstrapNodes[0];
  if (spec.codecType === 'eth') {
    return EthereumConnection.establish(url, {});
  }

  if (spec.codecType === 'bns') {
    return BnsConnection.establish(url);
  }

  if (spec.codecType === 'lsk') {
    return LiskConnection.establish(url);
  }

  return null;
}

export async function getTokens(): Promise<{ [ticker: string]: BwToken }> {
  const config = await loadConfig();
  const tokens: { [ticker: string]: BwToken } = {};
  const chains = config.chains;

  for (const chain of chains) {
    const connection = await createConnectionFor(chain.chainSpec);
    if (!connection) {
      continue;
    }

    const chainId = connection.chainId();
    const chainTokens = await connection.getAllTokens();

    for (const chainToken of chainTokens) {
      const ticker = chainToken.tokenTicker as string;
      tokens[ticker] = { chainId, token: chainToken };
    }
  }

  return tokens;
}

export const addTickersAction = (tokens: { [key: string]: BwToken }): AddTickerActionType => ({
  type: '@@bw/ADD_TOKENS',
  payload: tokens,
});
