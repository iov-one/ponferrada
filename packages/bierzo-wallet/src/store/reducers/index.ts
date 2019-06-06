import { connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';
import { ExtensionActions, ExtensionState, extensionReducer } from './extension';

export const history = createBrowserHistory();
type RootReducerType = Reducer<{ router: RouterState; extension: ExtensionState }>;

const createRootReducer = (history: History): RootReducerType =>
  combineReducers({
    router: connectRouter(history),
    extension: extensionReducer,
  });

export type RootActions = ExtensionActions;
export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer(history);
