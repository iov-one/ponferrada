import { Identity, isConfirmedTransaction } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../config';
import { addConfirmedTransaction } from '../store/notifications';
import { getCodec } from './codec';
import { getConnectionFor } from './connection';

let txsSubscriptions: Subscription[] = [];

export async function subscribeTransaction(
  keys: { [chain: string]: string },
  dispatch: Dispatch,
): Promise<void> {
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
    const subscription = connection.liveTx({ sentFromOrTo: address }).subscribe({
      next: async tx => {
        if (!isConfirmedTransaction(tx)) {
          throw new Error('Confirmed transaction expected');
        }

        await dispatch(addConfirmedTransaction(tx));
      },
    });
    txsSubscriptions.push(subscription);
  }

  // subscribe to transactions
  // const transactionsStream = connection.liveTx({ sentFromOrTo: address });
}

export function unsubscribeTransactions(): void {
  txsSubscriptions.forEach(subs => subs.unsubscribe());
  txsSubscriptions = [];
}
