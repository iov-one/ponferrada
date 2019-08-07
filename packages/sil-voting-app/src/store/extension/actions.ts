import { Governor } from "@iov/bns-governance";
import { TransactionEncoder } from "@iov/encoding";

import { sendGetIdentitiesRequest } from "../../communication/identities";
import { getBnsConnection } from "../../logic/connection";
import { ExtensionState, SetExtensionStateActionType } from "./reducer";

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, identity: undefined, governor: undefined };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, identity: undefined, governor: undefined };
  }

  const connection = await getBnsConnection();
  const governor = new Governor({ connection, identity: identities[0] });

  const identity = JSON.stringify(TransactionEncoder.toJson(identities[0]));

  return {
    installed: true,
    connected: true,
    identity,
    governor,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  identity: string | undefined,
  governor: Governor | undefined,
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, identity, governor },
});
