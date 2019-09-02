import { combineReducers, Reducer } from "redux";
import { StateType } from "typesafe-actions";

import { extensionReducer, ExtensionState } from "./extension";
import { proposalsReducer, ProposalsState } from "./proposals";
import { transactionsReducer, TransactionsState } from "./transactions";

export interface RootReducer {
  extension: ExtensionState;
  proposals: ProposalsState;
  transactions: TransactionsState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    proposals: proposalsReducer,
    transactions: transactionsReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer();
