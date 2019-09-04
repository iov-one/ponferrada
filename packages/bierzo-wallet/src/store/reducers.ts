import { Action, combineReducers, Reducer } from "redux";
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

export interface RootState {
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

const createRootReducer = (): Reducer<RootState> => (
  state: RootState | undefined,
  action: ActionType<typeof actions>,
) => {
  if (action.type === "@@app/RESET") {
    return allReducers(undefined, action);
  }

  return allReducers(state, action);
};

export default createRootReducer();
