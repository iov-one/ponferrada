import { ActionType } from 'typesafe-actions';

import { createDb } from '../../../logic/db';
import * as actions from '../actions';
import { ProfileState } from '../states';

export const DB_PROFILE_NAME = 'profile';
export type ProfileActions = ActionType<typeof actions>;
const initState = (): ProfileState => ({
  local: {
    db: createDb(DB_PROFILE_NAME),
  },
  external: {
    profile: undefined,
  },
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
    case 'CREATE_PROFILE_FULFILLED':
      return {
        ...state,
        local: { ...state.local },
        external: { profile: action.payload },
      };
    default:
      return state;
  }
}
