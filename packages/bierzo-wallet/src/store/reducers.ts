import { Action, combineReducers, Reducer } from "redux";
import { StateType } from "typesafe-actions";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";
import { balancesReducer, BalanceState } from "./balances";
import { identitiesReducer, IdentitiesState } from "./identities";
import { notificationReducer, NotificationState } from "./notifications";
import { tokensReducer, TokenState } from "./tokens";
import { usernamesReducer, UsernamesState } from "./usernames";

export interface ResetAppActionType extends Action {
  type: "@@app/RESET";
}

export interface RootReducer {
  identities: IdentitiesState;
  notifications: NotificationState;
  tokens: TokenState;
  balances: BalanceState;
  usernames: UsernamesState;
}

const allReducers = combineReducers({
  identities: identitiesReducer,
  notifications: notificationReducer,
  tokens: tokensReducer,
  balances: balancesReducer,
  usernames: usernamesReducer,
});

const createRootReducer = (): Reducer<RootReducer> => (
  state: RootReducer | undefined,
  action: ActionType<typeof actions>,
) => {
  if (action.type === "@@app/RESET") {
    return allReducers(undefined, action);
  }

  return allReducers(state, action);
};

export type RootState = StateType<ReturnType<typeof createRootReducer>>;

export default createRootReducer();
