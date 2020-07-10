import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface BwToken {
  readonly chainId: string;
  readonly token: {
    tokenTicker: string;
    fractionalDigits: number;
  };
}

export interface AddTickerActionType extends Action {
  type: "@@tokens/ADD";
  payload: { [key: string]: BwToken };
}

export type TokenActions = ActionType<typeof actions>;

export interface TokenState {
  [key: string]: BwToken;
}
const initState: TokenState = {};

export function tokensReducer(state: TokenState = initState, action: TokenActions): TokenState {
  switch (action.type) {
    case "@@tokens/ADD":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
