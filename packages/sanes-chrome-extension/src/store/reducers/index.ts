import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

export const history = createBrowserHistory();

// eslint-disable-next-line
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

export const reducer = createRootReducer(history);

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
