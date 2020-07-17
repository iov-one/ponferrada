import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface SetBalancesActionType extends Action {
  type: "@@balances/SET";
  payload: { [key: string]: number };
}

export type BalanceActions = ActionType<typeof actions>;

export interface BalanceState {
  [token: string]: number;
}
const initState: BalanceState = {};

export function balancesReducer(state: BalanceState = initState, action: BalanceActions): BalanceState {
  switch (action.type) {
    case "@@balances/SET":
      return { ...action.payload };
    default:
      return state;
  }
}
