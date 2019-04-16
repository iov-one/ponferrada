import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, compose, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { history, reducer, RootState } from './reducers';

const middlewares: ReadonlyArray<Middleware> = [thunk, routerMiddleware(history)];

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

export const makeStore = (): Store<RootState> => {
  const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(
      './reducers',
      (): void => {
        store.replaceReducer(reducer);
      }
    );
  }

  return store;
};

/**
 * This method can only be used in test enviromnets
 * @param localState Initial redux object
 */
export const aNewStore = (localState?: object): Store<RootState> =>
  createStore(reducer, localState, composeEnhancers(applyMiddleware(...middlewares)));
