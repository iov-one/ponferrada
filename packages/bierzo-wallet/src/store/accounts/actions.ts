import { Identity } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";

import { getConnectionForBns } from "../../logic/connection";
import { AddAccountsActionType, BwAccount } from "./reducer";

export async function getAccounts(identities: readonly Identity[]): Promise<readonly BwAccount[]> {
  const bnsConnection = await getConnectionForBns();

  const bnsIdentity = identities.find(ident => ident.chainId === bnsConnection.chainId);
  if (!bnsIdentity) return [];

  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const accounts = await bnsConnection.getAccounts({ owner: bnsAddress });

  return accounts.map(account => ({
    name: account.name ? account.name : "",
    domain: account.domain,
    expiryDate: new Date(account.validUntil * 1000),
    addresses: account.targets,
  }));
}

export const addAccountsAction = (accounts: readonly BwAccount[]): AddAccountsActionType => ({
  type: "@@accounts/ADD",
  payload: accounts,
});
