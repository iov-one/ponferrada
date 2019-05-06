import { connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';

export const history = createBrowserHistory();

const createRootReducer = (history: History): Reducer<{ router: RouterState }> =>
  combineReducers({
    router: connectRouter(history),
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export default createRootReducer(history);
