import { RootState } from '../reducers';
import { BwUsername } from '.';

export const getFirstUsername = (state: RootState): BwUsername | undefined => {
  const firstUsername = Object.values(state.usernames).find(() => true);
  return firstUsername;
};
