import { routerMiddleware } from 'connected-react-router';
import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  Store,
} from 'redux';
import thunk from 'redux-thunk';
import { history, reducer, RootState } from './reducers';

const middlewares: ReadonlyArray<Middleware> = [
  thunk,
  routerMiddleware(history),
];

const composeEnhancers =
  // eslint-disable-next-line
  (typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const makeStore = (): Store<RootState> => {
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
};
