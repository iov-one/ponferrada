import { SetExtensionStateActionType } from './reducer';

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
): SetExtensionStateActionType => ({
  type: '@@extension/SET_STATE',
  payload: { connected, installed },
});
