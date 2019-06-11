import { connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';
import { ExtensionState, extensionReducer } from './extension';

export interface RootReducer {
  router: RouterState;
  extension: ExtensionState;
}

export const history = createBrowserHistory();

const createRootReducer = (history: History): Reducer<RootReducer> =>
  combineReducers({
    router: connectRouter(history),
    extension: extensionReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer(history);
