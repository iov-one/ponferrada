import { RootState } from "../reducers";
import { BwUsername } from ".";

export const getFirstUsername = (state: RootState): BwUsername | undefined => {
  const firstUsername = state.usernames.find(() => true);
  return firstUsername;
};

export const getFirstUsernameWithNewChain = (state: RootState): BwUsername | undefined => {
  const firstUsernameWithNewChain = state.usernames.find(row =>
    row.addresses.find((address: any) => address.chainId === "starname-network-devnet"),
  );
  return firstUsernameWithNewChain;
};
