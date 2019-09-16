import { ReadonlyDate } from "readonly-date";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface BlockchainState {
  readonly lastBlockheight: number;
  readonly lastBlockTime: ReadonlyDate;
}

const initState: BlockchainState = {
  lastBlockheight: 0,
  lastBlockTime: new ReadonlyDate(0),
};

export interface SetBlockchainActionType extends Action {
  type: "@@blockchain/SET";
  payload: BlockchainState;
}

export type BlockchainActions = ActionType<typeof actions>;

export function blockchainReducer(
  state: BlockchainState = initState,
  action: BlockchainActions,
): BlockchainState {
  switch (action.type) {
    case "@@blockchain/SET":
      return action.payload;
    default:
      return state;
  }
}
