import { Action } from 'redux';
import { ExtensionState } from './state';

export interface SetExtensionStateActionType extends Action {
  type: '@@extension/SET_EXTENSION_STATE';
  payload: ExtensionState;
}
