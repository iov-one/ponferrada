import { Identity } from "@iov/bcp";

import { SetExtensionStateActionType } from "./reducer";

export const setExtensionStateAction = (identities: {
  [chain: string]: Identity;
}): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { identities },
});
