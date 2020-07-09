import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface BwUsername {
  readonly username: string;
  readonly addresses: readonly any[];
}

export interface AddUsernamesActionType extends Action {
  readonly type: "@@usernames/ADD";
  readonly payload: readonly BwUsername[];
}

export interface RemoveUsernameActionType extends Action {
  readonly type: "@@usernames/REMOVE";
  readonly payload: string;
}

export type UserNameActions = ActionType<typeof actions>;

export type UsernamesState = readonly BwUsername[];
const initState: UsernamesState = [];

export function usernamesReducer(state: UsernamesState = initState, action: UserNameActions): UsernamesState {
  switch (action.type) {
    case "@@usernames/ADD": {
      const updatedNames = action.payload.map(name => name.username);
      const oldNamesToCopy = state.filter(name => !updatedNames.includes(name.username));
      return [...oldNamesToCopy, ...action.payload];
    }
    case "@@usernames/REMOVE": {
      return state.filter(name => name.username !== action.payload);
    }
    default:
      return state;
  }
}
