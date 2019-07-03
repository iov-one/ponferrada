import { SetExtensionStateActionType } from './reducer';

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
): SetExtensionStateActionType => ({
  type: '@@bw/SET_EXTENSION_STATE',
  payload: { connected, installed },
});
