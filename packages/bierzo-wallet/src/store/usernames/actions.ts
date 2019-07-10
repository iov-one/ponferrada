import { AddUsernamesActionType, BwUsername } from './reducer';

export async function getUsernames(): Promise<any> {
  return {};
}

export const addUsernamesAction = (usernames: { [chainId: string]: BwUsername }): AddUsernamesActionType => ({
  type: '@@usernames/ADD',
  payload: usernames,
});
