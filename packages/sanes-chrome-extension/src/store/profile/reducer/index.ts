import { ActionType } from 'typesafe-actions';

import * as actions from '../actions';
import { ProfileState } from '../types';

export type ProfileActions = ActionType<typeof actions>;
const initState = (): ProfileState => ({
  username: undefined,
  bnsName: undefined,
});

export function profileReducer(
  maybeState: ProfileState | undefined,
  action: ProfileActions
): ProfileState {
  // we create it dynamically in the function rather than default argument
  // using a global initState object meant re-using the same database in all tests
  // this has same effect, but allow multiple initializations in one process
  const state = maybeState ? maybeState : initState();
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username,
      };
    default:
      return state;
  }
}
