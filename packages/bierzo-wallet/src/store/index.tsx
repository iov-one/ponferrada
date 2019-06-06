import { routerMiddleware, RouterState } from 'connected-react-router';
import { applyMiddleware, compose, createStore, Store, Middleware } from 'redux';
import reducer, { history } from './reducers';
import thunk from 'redux-thunk';

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

const middlewares: ReadonlyArray<Middleware> = [thunk, routerMiddleware(history)];

export const configureStore = (): Store<{ router: RouterState }> => {
  const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(
      './reducers',
      (): void => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nextRootReducer = require('./reducers');
        store.replaceReducer(nextRootReducer);
      },
    );
  }

  return store;
};
