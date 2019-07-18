import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';

import { sendGetIdentitiesRequest } from '../../communication/identities';
import { ExtensionState } from '../../store/extension';
import { SetExtensionStateActionType } from './reducer';

/**
 * Groups the identites by blockchain.
 *
 * TODO: Right now only the last identity per blockchain is returned. This should be generalized
 * to support multiple identities per blockchain.
 */
function groupIdentitiesByChain(identities: readonly Identity[]): { [chainId: string]: Identity } {
  const out: { [chainId: string]: Identity } = {};
  for (const identity of identities) {
    out[identity.chainId] = identity;
  }
  return out;
}

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, keys: {} };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, keys: {} };
  }

  const groupedIdentities = groupIdentitiesByChain(identities);

  const publicKeys: { [chain: string]: string } = {};
  for (const [chainId, identity] of Object.entries(groupedIdentities)) {
    publicKeys[chainId] = JSON.stringify(TransactionEncoder.toJson(identity));
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
  keys: { [chain: string]: string },
): SetExtensionStateActionType => ({
  type: '@@extension/SET_STATE',
  payload: { connected, installed, keys },
});
