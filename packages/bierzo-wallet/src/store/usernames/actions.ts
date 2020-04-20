import { Identity } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";

import { getConnectionForBns } from "../../logic/connection";
import { AddUsernamesActionType, BwUsername, RemoveUsernameActionType } from "./reducer";

export async function getUsernames(identities: readonly Identity[]): Promise<readonly BwUsername[]> {
  const bnsConnection = await getConnectionForBns();

  const bnsIdentity = identities.find(ident => ident.chainId === bnsConnection.chainId);
  if (!bnsIdentity) return [];

  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const usernames = await bnsConnection.getUsernames({ owner: bnsAddress });

  return usernames.map(username => ({
    username: username.id,
    addresses: username.targets,
  }));
}

export const addUsernamesAction = (usernames: readonly BwUsername[]): AddUsernamesActionType => ({
  type: "@@usernames/ADD",
  payload: usernames,
});

export const removeUsernameAction = (username: string): RemoveUsernameActionType => ({
  type: "@@usernames/REMOVE",
  payload: username,
});
