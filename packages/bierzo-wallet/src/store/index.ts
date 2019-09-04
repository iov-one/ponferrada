import { applyMiddleware, compose, createStore, DeepPartial, Middleware, Store } from "redux";

import reducers, { RootState } from "./reducers";
export * from "./actions";

const composeEnhancers =
  (typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

const middlewares: readonly Middleware[] = [];

export const configureStore = (): Store<RootState> => {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", (): void => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export const aNewStore = (preloadedStore?: DeepPartial<RootState>): Store<RootState> => {
  return createStore(reducers, preloadedStore, composeEnhancers(applyMiddleware(...middlewares)));
};
