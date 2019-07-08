import { getConfig } from '../../config';
import { getConnectionFor } from '../../logic/connection';
import { amountToString } from '../../utils/balances';
import { AddBalancesActionType } from './reducer';

export async function getBalances(): Promise<{ [ticker: string]: string }> {
  const config = getConfig();
  const chains = config.chains;

  const balances: { [ticker: string]: string } = {};
  const token = 'FAKE_TOKEN';
  const pubkey: any = 'fakePubKey';

  for (const chain of chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    const account = await connection.getAccount({ pubkey });

    if (!account) {
      continue;
    }

    for (const balance of account.balance) {
      balances[token] = amountToString(balance);
    }
  }

  return balances;
}

export const addBalancesAction = (tokens: { [key: string]: string }): AddBalancesActionType => ({
  type: '@@balances/ADD',
  payload: tokens,
});
