import { Amount } from "@iov/bcp";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface AddBalancesActionType extends Action {
  type: "@@balances/ADD";
  payload: { [key: string]: Amount };
}

export type BalanceActions = ActionType<typeof actions>;

export interface BalanceState {
  [token: string]: Amount;
}
const initState: BalanceState = {};

export function balancesReducer(state: BalanceState = initState, action: BalanceActions): BalanceState {
  switch (action.type) {
    case "@@balances/ADD":
      return { ...action.payload };
    default:
      return state;
  }
}
