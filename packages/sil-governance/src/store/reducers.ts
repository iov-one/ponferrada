import { combineReducers, Reducer } from "redux";
import { StateType } from "typesafe-actions";

import { blockchainReducer, BlockchainState } from "./blockchain";
import { extensionReducer, ExtensionState } from "./extension";
import { proposalsReducer, ProposalsState } from "./proposals";
import { transactionsReducer, TransactionsState } from "./transactions";

export interface RootReducer {
  extension: ExtensionState;
  blockchain: BlockchainState;
  proposalsState: ProposalsState;
  transactions: TransactionsState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    blockchain: blockchainReducer,
    proposalsState: proposalsReducer,
    transactions: transactionsReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer();
