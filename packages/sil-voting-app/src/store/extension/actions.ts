import { TransactionEncoder } from "@iov/encoding";

import { sendGetIdentitiesRequest } from "../../communication/identities";
import { ExtensionState, SetExtensionStateActionType } from "./reducer";

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, identity: undefined };
  }

  if (Object.keys(identities).length === 0) {
    return { installed: true, connected: false, identity: undefined };
  }

  const identity = JSON.stringify(TransactionEncoder.toJson(identities[0]));

  return {
    installed: true,
    connected: true,
    identity,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  identity: string | undefined,
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, identity },
});
