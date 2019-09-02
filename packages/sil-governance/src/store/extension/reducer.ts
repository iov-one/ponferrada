import { TransactionId } from "@iov/bcp";
import { Governor } from "@iov/bns-governance";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface ExtensionState {
  readonly connected: boolean;
  readonly installed: boolean;
  readonly governor: Governor | undefined;
  readonly lastSignAndPostResult?: TransactionId | null;
}

export interface SetExtensionStateActionType extends Action {
  type: "@@extension/SET_STATE";
  payload: ExtensionState;
}

export type ExtensionActions = ActionType<typeof actions>;

const initState: ExtensionState = {
  connected: false,
  installed: false,
  governor: undefined,
};

export function extensionReducer(
  state: ExtensionState = initState,
  action: ExtensionActions,
): ExtensionState {
  switch (action.type) {
    case "@@extension/SET_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
