export const SET_USERNAME = 'SET_USERNAME';
export type SET_USERNAME = typeof SET_USERNAME;

export interface User {
  username: string;
}

export interface ProfileState {
  readonly username: string;
  readonly bnsName?: string;
}
