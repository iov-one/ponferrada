import { EthereumConnection } from '@iov/ethereum';
import { AddTickerActionType, BwToken } from './reducer';

export async function getTokens(): Promise<{ [key: string]: BwToken }> {
  const tokens: { [ticker: string]: BwToken } = {};

  // TODO for now we only check the ethereum connection. The rest of chains will be
  // added after it. Stay tuned!
  const connection = await EthereumConnection.establish('http://localhost:8545', {});
  const chainId = connection.chainId();
  const chainTokens = await connection.getAllTokens();

  for (const chainToken of chainTokens) {
    const ticker = chainToken.tokenTicker as string;
    tokens[ticker] = { chainId, token: chainToken };
  }

  return tokens;
}

export const addTickersAction = (tokens: { [key: string]: BwToken }): AddTickerActionType => ({
  type: '@@bw/ADD_TOKENS',
  payload: tokens,
});
