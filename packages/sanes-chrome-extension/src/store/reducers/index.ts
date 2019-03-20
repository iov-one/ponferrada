import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { ProfileActions, profileReducer } from '../profile/reducer';

export const history = createBrowserHistory();

// eslint-disable-next-line
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    profile: profileReducer,
  });

export const reducer = createRootReducer(history);

export type RootActions = ProfileActions;
export type RootState = StateType<ReturnType<typeof createRootReducer>>;
