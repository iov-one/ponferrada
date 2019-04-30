import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import reducer, { history } from './reducers';

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

export const configureStore = () => {
  const store = createStore(reducer, composeEnhancers(applyMiddleware(routerMiddleware(history))));

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(
      './reducers',
      (): void => {
        const nextRootReducer = require('./reducers');
        store.replaceReducer(nextRootReducer);
      }
    );
  }

  return store;
};
