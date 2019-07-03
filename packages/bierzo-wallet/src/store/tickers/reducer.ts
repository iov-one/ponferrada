import { ChainId, Token } from '@iov/bcp';
import { Action } from 'redux';

export interface TickerState {
  readonly chainId: ChainId;
  readonly tokens: ReadonlyArray<Token>;
}

export interface AddTickerActionType extends Action {
  type: '@@bw/ADD_TICKERS';
  payload: ReadonlyArray<TickerState>;
}
