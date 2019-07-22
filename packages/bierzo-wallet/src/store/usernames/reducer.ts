import { ChainAddressPair } from '@iov/bns';
import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from './actions';

export interface BwUsername {
  readonly username: string;
  readonly addresses: readonly ChainAddressPair[];
}

export interface AddUsernamesActionType extends Action {
  readonly type: '@@usernames/ADD';
  readonly payload: readonly BwUsername[];
}

export type UserNameActions = ActionType<typeof actions>;

export type UsernamesState = readonly BwUsername[];
const initState: UsernamesState = [];

export function usernamesReducer(state: UsernamesState = initState, action: UserNameActions): UsernamesState {
  switch (action.type) {
    case '@@usernames/ADD':
      return [...state, ...action.payload];
    default:
      return state;
  }
}
