import { ChainId, Token } from '@iov/bcp';
import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

export interface BwToken {
  readonly chainId: ChainId;
  readonly token: Token;
}

export interface AddTickerActionType extends Action {
  type: '@@bw/ADD_TOKENS';
  payload: { [key: string]: BwToken };
}

export type TokenActions = ActionType<typeof actions>;

export interface TokenState {
  [key: string]: BwToken;
}
const initState: TokenState = {};

export function tokensReducer(state: TokenState = initState, action: TokenActions): TokenState {
  switch (action.type) {
    case '@@bw/ADD_TOKENS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
