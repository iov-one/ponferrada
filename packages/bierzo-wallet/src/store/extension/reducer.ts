import { Identity } from "@iov/bcp";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface IdentitiesState {
  [chain: string]: Identity;
}

export interface SetIdentitiesStateActionType extends Action {
  type: "@@identities/SET_STATE";
  payload: IdentitiesState;
}

export type IdentitiesActions = ActionType<typeof actions>;

const initState: IdentitiesState = {};

export function identitiesReducer(
  state: IdentitiesState = initState,
  action: IdentitiesActions,
): IdentitiesState {
  switch (action.type) {
    case "@@identities/SET_STATE":
      return action.payload;
    default:
      return state;
  }
}
