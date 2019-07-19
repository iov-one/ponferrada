import { RootState } from '../reducers';
import { BwUsername } from '.';

export const getUsername = (state: RootState): BwUsername | undefined =>
  Object.values(state.usernames).find(username => username);
