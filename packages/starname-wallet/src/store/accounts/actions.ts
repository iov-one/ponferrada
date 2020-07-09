import { AddAccountsActionType, BwAccount, RemoveAccountActionType } from "./reducer";
import { Target } from "logic/api";

export async function getAccounts(identities: readonly Target[]): Promise<readonly BwAccount[]> {
  /*const bnsConnection = await getConnectionForBns();

  const bnsIdentity = identities.find(ident => ident.chainId === bnsConnection.chainId);
  if (!bnsIdentity) return [];

  const bnsAddress = bnsCodec.identityToAddress(bnsIdentity);

  const accounts = await bnsConnection.getAccounts({ owner: bnsAddress });

  return accounts.map(account => ({
    name: account.name ? account.name : "",
    domain: account.domain,
    expiryDate: new Date(account.validUntil * 1000),
    addresses: account.targets,
    owner: account.owner,
  }));*/
  return [];
}

export const addAccountsAction = (accounts: readonly BwAccount[]): AddAccountsActionType => {
  return {
    type: "@@accounts/ADD",
    payload: accounts,
  };
};

export const removeAccountAction = (accountName: string): RemoveAccountActionType => ({
  type: "@@accounts/REMOVE",
  payload: accountName,
});
