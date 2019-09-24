import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  Store,
} from "redux";

import { getProposals, replaceProposalsAction, ReplaceProposalsActionType } from "./proposals";
import reducer, { RootReducer, RootState } from "./reducers";

const composeEnhancers =
  (typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line
  compose;

const replaceProposals = async (
  dispatch: Dispatch<ReplaceProposalsActionType>,
  state: RootState,
): Promise<void> => {
  const governor = state.extension.governor;

  if (governor) {
    const proposals = await getProposals(governor);
    dispatch(replaceProposalsAction(proposals));
  }
};

const refreshProposalsActionMw = ({
  dispatch,
  getState,
}: MiddlewareAPI): ((next: Dispatch<AnyAction>) => (action: AnyAction) => any) => next => {
  return action => {
    if (action.type === "@@proposals/REFRESH") replaceProposals(dispatch, getState());

    next(action);
  };
};

const refreshProposalsPeriodicallyMw: Middleware<{}, RootState, Dispatch<AnyAction>> = ({
  dispatch,
  getState,
}: MiddlewareAPI): ((next: Dispatch<AnyAction>) => (action: AnyAction) => any) => next => {
  const refreshProposals = async (): Promise<void> => {
    await replaceProposals(dispatch, getState());
    setTimeout(refreshProposals, 3000);
  };

  refreshProposals();

  return action => next(action);
};

const middlewares: readonly Middleware[] = [refreshProposalsActionMw, refreshProposalsPeriodicallyMw];

export const configureStore = (): Store<RootReducer> => {
  const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", (): void => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

/**
 * This method can only be used in test enviromnets
 * @param localState Initial redux object
 */
export const aNewStore = (localState?: object): Store<RootState> =>
  createStore(reducer, localState, composeEnhancers(applyMiddleware(...middlewares)));
