import { Address, ChainId } from '@iov/bcp';
import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from './actions';

export interface BwUsername {
  readonly chainId: ChainId;
  readonly address: Address;
  readonly username?: string;
}

export interface AddUsernamesActionType extends Action {
  type: '@@usernames/ADD';
  payload: { [chainId: string]: BwUsername };
}

export type UserNameActions = ActionType<typeof actions>;

export interface UsernamesState {
  [chainId: string]: BwUsername;
}
const initState: UsernamesState = {};

export function usernamesReducer(state: UsernamesState = initState, action: UserNameActions): UsernamesState {
  switch (action.type) {
    case '@@usernames/ADD':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
