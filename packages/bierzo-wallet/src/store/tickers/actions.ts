import { EthereumConnection } from '@iov/ethereum';
import { AddTickerActionType, TickerState } from './reducer';

export async function getTickers(): Promise<ReadonlyArray<TickerState>> {
  const tickers = [];

  // TODO for now we only check the ethereum connection. The rest of chains will be
  // added after it. Stay tuned!
  const connection = await EthereumConnection.establish('http://localhost:8545', {});
  const chainId = connection.chainId();
  const chainTokens = await connection.getAllTokens();

  tickers.push({ chainId, tokens: chainTokens });

  return tickers;
}

export const addTickersAction = (tokens: ReadonlyArray<TickerState>): AddTickerActionType => ({
  type: '@@bw/ADD_TICKERS',
  payload: tokens,
});
