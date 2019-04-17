import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { createRootReducer } from './reducers';

export const history = createBrowserHistory();

export const configureStore = () => {
  const store = createStore(
    createRootReducer(history),
    compose(applyMiddleware(routerMiddleware(history)))
  );

  return store;
};
