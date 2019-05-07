import { connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers, Reducer } from 'redux';

export const history = createBrowserHistory();

const createRootReducer = (history: History): Reducer<{ router: RouterState }> =>
  combineReducers({
    router: connectRouter(history),
  });

export default createRootReducer(history);
