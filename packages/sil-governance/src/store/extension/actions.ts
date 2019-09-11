import { Governor } from "@iov/bns-governance";

import { SetExtensionStateActionType } from "./reducer";

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  governor: Governor | undefined,
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, governor },
});
