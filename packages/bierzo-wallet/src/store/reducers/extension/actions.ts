import { SetExtensionStateActionType } from './types';

export const setExtensionStateAction = (
  extensionConnected: boolean,
  personaActive: boolean,
): SetExtensionStateActionType => ({
  type: '@@extension/SET_EXTENSION_STATE',
  payload: { personaActive, extensionConnected },
});
