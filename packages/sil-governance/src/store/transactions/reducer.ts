import { TransactionId } from "@iov/bcp";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface TransactionsState {
  lastSignAndPostResult?: TransactionId | null;
}

export interface SetTransactionsStateActionType extends Action {
  type: "@@transactions/SET_STATE";
  payload: TransactionsState;
}

export type TransactionsActions = ActionType<typeof actions>;

const initState: TransactionsState = {};

export function transactionsReducer(
  state: TransactionsState = initState,
  action: TransactionsActions,
): TransactionsState {
  switch (action.type) {
    case "@@transactions/SET_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
