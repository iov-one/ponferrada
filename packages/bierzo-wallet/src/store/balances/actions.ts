import { Amount, Identity } from "@iov/bcp";

import { getActiveConnections } from "../../logic/connection";
import { AddBalancesActionType } from "./reducer";

export async function getBalances(identities: readonly Identity[]): Promise<{ [ticker: string]: Amount }> {
  const connections = getActiveConnections();

  const balances: { [ticker: string]: Amount } = {};

  for (const connection of connections) {
    const identity = identities.find(identity => identity.chainId === connection.chainId());
    if (!identity) {
      continue;
    }
    const account = await connection.getAccount({ pubkey: identity.pubkey });
    if (!account) {
      continue;
    }

    for (const balance of account.balance) {
      balances[balance.tokenTicker] = balance;
    }
  }

  return balances;
}

export const addBalancesAction = (tokens: { [key: string]: Amount }): AddBalancesActionType => ({
  type: "@@balances/ADD",
  payload: tokens,
});
