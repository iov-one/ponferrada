import { Target } from "logic/api";

import { AddUsernamesActionType, BwUsername, RemoveUsernameActionType } from "./reducer";

export async function getUsernames(identities: readonly Target[]): Promise<readonly BwUsername[]> {
  /* const bnsConnection = await getConnectionForBns();

  const bnsIdentity = identities.find(ident => ident.chainId === bnsConnection.chainId);
  if (!bnsIdentity) return [];

  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const usernames = await bnsConnection.getUsernames({ owner: bnsAddress });

  return usernames.map(username => ({
    username: username.id,
    addresses: username.targets,
  }));*/
  return [];
}

export const addUsernamesAction = (usernames: readonly BwUsername[]): AddUsernamesActionType => ({
  type: "@@usernames/ADD",
  payload: usernames,
});

export const removeUsernameAction = (username: string): RemoveUsernameActionType => ({
  type: "@@usernames/REMOVE",
  payload: username,
});
