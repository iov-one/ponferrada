import { SET_USERNAME } from '../types';

export interface SetUsername {
  type: SET_USERNAME;
  username: string;
}

export type UserAction = SetUsername;

export function setUsername(newUsername: string): SetUsername {
  return {
    type: SET_USERNAME,
    username: newUsername,
  };
}
