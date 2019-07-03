import { ChainId, Token } from '@iov/bcp';
import { Action } from 'redux';

export interface TickerState {
  readonly chainId: ChainId;
  readonly token: Token;
}

export interface AddTickerActionType extends Action {
  type: '@@bw/ADD_TICKERS';
  payload: TickerState;
}
