import { combineReducers, Reducer } from "redux";

import { blockchainReducer, BlockchainState } from "./blockchain";
import { extensionReducer, ExtensionState } from "./extension";
import { proposalsReducer, ProposalsState } from "./proposals";
import { transactionsReducer, TransactionsState } from "./transactions";

export interface RootState {
  extension: ExtensionState;
  blockchain: BlockchainState;
  proposals: ProposalsState;
  transactions: TransactionsState;
}

const createRootReducer = (): Reducer<RootState> =>
  combineReducers({
    extension: extensionReducer,
    blockchain: blockchainReducer,
    proposals: proposalsReducer,
    transactions: transactionsReducer,
  });

export default createRootReducer();
