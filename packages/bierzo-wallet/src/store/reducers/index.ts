import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers } from 'redux';

export const history = createBrowserHistory();

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });
<<<<<<< HEAD:packages/bierzo-wallet/src/store/reducers/index.ts

export default createRootReducer(history);
=======
>>>>>>> Adds DOM test for welcome page with failing build:packages/bierzo-wallet/src/store/reducers/index.tsx
