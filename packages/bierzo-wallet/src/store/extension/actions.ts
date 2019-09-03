import { Identity } from "@iov/bcp";

import { SetExtensionStateActionType } from "./reducer";

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  identities: { [chain: string]: Identity },
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, identities },
});
