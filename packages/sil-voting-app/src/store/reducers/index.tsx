import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';

import { extensionReducer, ExtensionState } from './extension';

export interface RootReducer {
  extension: ExtensionState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer();
