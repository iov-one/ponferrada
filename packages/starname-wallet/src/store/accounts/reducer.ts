import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface BwAccount {
  readonly name: string;
  readonly domain: string;
  readonly expiryDate: Date;
  readonly owner: string;
  readonly addresses: readonly any[];
}

export interface AddAccountsActionType extends Action {
  readonly type: "@@accounts/ADD";
  readonly payload: readonly BwAccount[];
}

export interface RemoveAccountActionType extends Action {
  readonly type: "@@accounts/REMOVE";
  readonly payload: string;
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
    case "@@accounts/REMOVE": {
      return state.filter(oldAccount => !`${oldAccount.name}*${oldAccount.domain}`.endsWith(action.payload));
    }
    default:
      return state;
  }
}
