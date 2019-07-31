import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../../config';
import { addTransaction } from '../../store/notifications';
import { getCodec } from '../codec';
import { getConnectionFor } from '../connection';
import { BwTransactionFactory } from './types/BwTransactionFactory';

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
        const bwTransaction = BwTransactionFactory.getBwTransactionFrom(tx);
        const parsedTx = await bwTransaction.parse(connection, tx, address);

        await dispatch(addTransaction(parsedTx));
      },
      error: error => console.error(error),
    });
    txsSubscriptions.push(subscription);
  }
}

export function unsubscribeTransactions(): void {
  txsSubscriptions.forEach(subs => subs.unsubscribe());
  txsSubscriptions = [];
}
