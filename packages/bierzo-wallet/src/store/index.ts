import { applyMiddleware, combineReducers, compose, createStore, Middleware, Reducer, Store } from 'redux';
import { StateType } from 'typesafe-actions';
import { extensionReducer, ExtensionState } from './extension';
import { notificationReducer, NotificationState } from './notifications';

export interface RootReducer {
  extension: ExtensionState;
  notifications: NotificationState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    notifications: notificationReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;

const composeEnhancers =
  (typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

const middlewares: ReadonlyArray<Middleware> = [];

export const configureStore = (): Store<RootReducer> => {
  const store = createStore(createRootReducer(), composeEnhancers(applyMiddleware(...middlewares)));

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
