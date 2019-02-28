import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose, Middleware, Store } from "redux";
import thunk from "redux-thunk";
import { createRootReducer, RootState } from "./reducers";

export let history = createBrowserHistory();

const middlewares: ReadonlyArray<Middleware> = [thunk, routerMiddleware(history)];

const reducers = createRootReducer(history);
const composeEnhancers =
  // eslint-disable-next-line
  (typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const makeStore = (): Store<RootState> =>
  createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
