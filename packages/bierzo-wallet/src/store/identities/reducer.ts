import { Address, ChainId, Identity } from "@iov/bcp";
import { Action } from "redux";

import { IdentitiesActions } from "./actions";

export interface ExtendedIdentity {
  readonly identity: Identity;
  readonly address: Address;
  readonly chainName: string;
}

export type IdentitiesState = ReadonlyMap<ChainId, ExtendedIdentity>;

export interface SetIdentitiesStateActionType extends Action {
  type: "@@identities/SET";
  payload: IdentitiesState;
}

const initState: IdentitiesState = new Map();

export function identitiesReducer(
  state: IdentitiesState = initState,
  action: IdentitiesActions,
): IdentitiesState {
  switch (action.type) {
    case "@@identities/SET":
      return action.payload;
    default:
      return state;
  }
}
