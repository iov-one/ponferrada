import { ChainId, Identity } from "@iov/bcp";
import { bnsCodec, BnsConnection } from "@iov/bns";

import { getConfig } from "../../config";
import { getConnectionFor, isBnsSpec } from "../../logic/connection";
import { AddUsernamesActionType, BwUsername } from "./reducer";

export async function getUsernames(
  identities: ReadonlyMap<ChainId, Identity>,
): Promise<readonly BwUsername[]> {
  const bnsChainSpec = (await getConfig()).chains.map(chain => chain.chainSpec).find(isBnsSpec);
  if (!bnsChainSpec) throw new Error("Missing BNS chain spec in config");

  const bnsConnection = (await getConnectionFor(bnsChainSpec)) as BnsConnection;

  const bnsIdentity = identities.get(bnsConnection.chainId());
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
