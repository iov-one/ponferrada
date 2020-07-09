import { SetBalancesActionType } from "./reducer";
import { Target } from "logic/api";

export async function getBalances(identities: readonly Target[]): Promise<{ [ticker: string]: any }> {
  const balances: { [ticker: string]: any } = {};
  /*const connections = getActiveConnections();
  for (const connection of connections) {
    const identity = identities.find(identity => identity.chainId === connection.chainId);
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
  }*/
  return balances;
}

export const setBalancesAction = (tokens: { [key: string]: any }): SetBalancesActionType => ({
  type: "@@balances/SET",
  payload: tokens,
});
