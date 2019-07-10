import { Amount, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';

import { getConfig } from '../../config';
import { getConnectionFor } from '../../logic/connection';
import { AddBalancesActionType } from './reducer';

export async function getBalances(keys: { [chain: string]: string }): Promise<{ [ticker: string]: Amount }> {
  const config = getConfig();
  const chains = config.chains;

  const balances: { [ticker: string]: Amount } = {};

  for (const chain of chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId() as string;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const pubIdentity: PublicIdentity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
    const account = await connection.getAccount({ pubkey: pubIdentity.pubkey });
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
  type: '@@balances/ADD',
  payload: tokens,
});
