import { RootState } from "../reducers";
import { BwUsername } from ".";

export const getFirstUsername = (state: RootState): BwUsername | undefined => {
  const firstUsername = state.usernames.find(() => true);
  return firstUsername;
};

export const getFirstUsernameMigrated = (state: RootState): BwUsername | undefined => {
  const firstUsernameWithNewChain = state.usernames.find(row =>
    row.addresses.find(address => address.chainId === "starname-migration"),
  );
  return firstUsernameWithNewChain;
};
