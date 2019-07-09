import { TransactionEncoder } from '@iov/core';

import { sendGetIdentitiesRequest } from '../../communication/identities';
import { ExtensionState } from '../../store/extension';
import { SetExtensionStateActionType } from './reducer';

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, keys: {} };
  }

  const keys = Object.keys(identities);
  const hasKeys = keys.length > 0;
  if (!hasKeys) {
    return { installed: true, connected: false, keys: {} };
  }

  let publicKeys: { [chain: string]: string } = {};

  for (const key of keys) {
    publicKeys[key] = JSON.stringify(TransactionEncoder.toJson(identities[key]));
  }

  return {
    installed: true,
    connected: true,
    keys: publicKeys,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
): SetExtensionStateActionType => ({
  type: '@@extension/SET_STATE',
  payload: { connected, installed },
});
