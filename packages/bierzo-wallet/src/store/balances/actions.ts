import { Amount, ChainId, Identity } from "@iov/bcp";

import { getConfig } from "../../config";
import { getConnectionFor } from "../../logic/connection";
import { AddBalancesActionType } from "./reducer";

export async function getBalances(
  identities: ReadonlyMap<ChainId, Identity>,
): Promise<{ [ticker: string]: Amount }> {
  const config = await getConfig();
  const chains = config.chains;

  const balances: { [ticker: string]: Amount } = {};

  for (const chain of chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    const identity = identities.get(connection.chainId());
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
