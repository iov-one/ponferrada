import { routerMiddleware } from 'connected-react-router';
<<<<<<< HEAD
import { applyMiddleware, compose, createStore } from 'redux';
import reducer, { history } from './reducers';
=======
import { History } from 'history';
import { applyMiddleware, compose, createStore, Reducer } from 'redux';
>>>>>>> Adds DOM test for welcome page with failing build

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

export const configureStore = (reducer: Reducer, history: History) => {
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
