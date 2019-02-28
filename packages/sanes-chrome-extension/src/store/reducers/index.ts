import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

// eslint-disable-next-line
export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
