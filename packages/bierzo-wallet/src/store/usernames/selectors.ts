import { RootState } from "../reducers";
import { BwUsername } from ".";

export const getFirstUsername = (state: RootState): BwUsername | undefined => {
  const firstUsername = state.usernames.find(() => true);
  return firstUsername;
};
