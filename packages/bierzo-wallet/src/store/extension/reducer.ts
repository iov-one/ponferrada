import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from './actions';

export interface ExtensionState {
  readonly connected: boolean;
  readonly installed: boolean;
}

export interface SetExtensionStateActionType extends Action {
  type: '@@bw/SET_EXTENSION_STATE';
  payload: ExtensionState;
}

export type ExtensionActions = ActionType<typeof actions>;

const initState: ExtensionState = {
  connected: false,
  installed: false,
};

export function extensionReducer(
  state: ExtensionState = initState,
  action: ExtensionActions,
): ExtensionState {
  switch (action.type) {
    case '@@bw/SET_EXTENSION_STATE':
      return action.payload;
    default:
      return state;
  }
}
