import { combineReducers, Reducer } from "redux";
import { StateType } from "typesafe-actions";

import { extensionReducer, ExtensionState } from "./extension";
import { proposalsReducer, ProposalsState } from "./proposals";

export interface RootReducer {
  extension: ExtensionState;
  proposals: ProposalsState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    proposals: proposalsReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer();
