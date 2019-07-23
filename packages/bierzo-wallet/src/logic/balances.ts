import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/multichain';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../config';
import { addBalancesAction, getBalances } from '../store/balances';
import { getCodec } from './codec';
import { getConnectionFor } from './connection';

let balanceSubscriptions: Subscription[] = [];

export async function subscribeBalance(keys: { [chain: string]: string }, dispatch: Dispatch): Promise<void> {
  const config = getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    const codec = getCodec(chain.chainSpec);
    const connection = await getConnectionFor(chain.chainSpec);
    const chainId = connection.chainId() as string;
    const plainPubkey = keys[chainId];
    if (!plainPubkey) {
      continue;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));
    const address = codec.identityToAddress(identity);

    // subscribe to balance changes via
    const subscription = connection.watchAccount({ address }).subscribe({
      next: async account => {
        const balances = await getBalances(keys);

        await dispatch(addBalancesAction(balances));
      },
    });
    balanceSubscriptions.push(subscription);
  }

  // subscribe to transactions
  // const transactionsStream = connection.liveTx({ sentFromOrTo: address });
}

export function unsubscribeBalances(): void {
  balanceSubscriptions.forEach(subs => subs.unsubscribe());
  balanceSubscriptions = [];
}
