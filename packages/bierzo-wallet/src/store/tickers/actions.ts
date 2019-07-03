import { ChainId, Token } from '@iov/bcp';
import { AddTickerActionType } from './reducer';

export const addTickersAction = (chainId: ChainId, token: Token): AddTickerActionType => ({
  type: '@@bw/ADD_TICKERS',
  payload: { chainId, token },
});
