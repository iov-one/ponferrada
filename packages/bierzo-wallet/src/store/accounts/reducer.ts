import { ChainAddressPair } from "@iov/bns";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface BwAccount {
  readonly name: string;
  readonly domain: string;
  readonly expiryDate: Date;
  readonly addresses: readonly ChainAddressPair[];
}

export interface AddAccountsActionType extends Action {
  readonly type: "@@accounts/ADD";
  readonly payload: readonly BwAccount[];
}

export type AccountsActions = ActionType<typeof actions>;

export type AccountsState = readonly BwAccount[];
const initState: AccountsState = [];

export function accountsReducer(state: AccountsState = initState, action: AccountsActions): AccountsState {
  switch (action.type) {
    case "@@accounts/ADD": {
      const updatedAccounts = action.payload.map(
        updatedAccount => `${updatedAccount.name}*${updatedAccount.domain}`,
      );
      const oldAccountsToCopy = state.filter(
        oldAccount => !updatedAccounts.includes(`${oldAccount.name}*${oldAccount.domain}`),
      );
      return [...oldAccountsToCopy, ...action.payload];
    }
    default:
      return state;
  }
}
