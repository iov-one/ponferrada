import { Identity } from "@iov/bcp";

import { sendGetIdentitiesRequest } from "../../communication/identities";
import { ExtensionState } from "../../store/extension";
import { SetExtensionStateActionType } from "./reducer";

/**
 * Groups the identites by blockchain. Returns the first identity of each chain.
 *
 * The browser extension is supposed to only send one identity per chain.
 * @see https://github.com/iov-one/ponferrada/issues/447
 */
export function groupIdentitiesByChain(identities: readonly Identity[]): { [chainId: string]: Identity } {
  const out: { [chainId: string]: Identity } = {};
  for (const identity of identities) {
    if (!out.hasOwnProperty(identity.chainId)) {
      out[identity.chainId] = identity;
    }
  }
  return out;
}

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, identities: {} };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, identities: {} };
  }

  const groupedIdentities = groupIdentitiesByChain(identities);

  return {
    installed: true,
    connected: true,
    identities: groupedIdentities,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  identities: { [chain: string]: Identity },
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, identities },
});
