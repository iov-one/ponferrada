import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ExtensionState } from './state';

export type ExtensionActions = ActionType<typeof actions>;

const initState: ExtensionState = {
  personaActive: true,
  extensionConnected: true,
};

export function extensionReducer(
  state: ExtensionState = initState,
  action: ExtensionActions,
): ExtensionState {
  switch (action.type) {
    case '@@extension/SET_EXTENSION_STATE':
      return action.payload;
    default:
      return state;
  }
}
