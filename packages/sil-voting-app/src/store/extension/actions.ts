import { sendGetIdentitiesRequest } from "../../communication/identities";
import { ExtensionState, SetExtensionStateActionType } from "./reducer";

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false };
  }

  if (Object.keys(identities).length === 0) {
    return { installed: true, connected: false };
  }

  return {
    installed: true,
    connected: true,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed },
});
