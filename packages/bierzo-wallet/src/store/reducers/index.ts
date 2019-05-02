import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers } from 'redux';

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

export default createRootReducer(history);
