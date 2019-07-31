import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  Identity,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
  SendTransaction,
} from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../../config';
import { addTransaction } from '../../store/notifications';
import { getCodec } from '../codec';
import { getConnectionFor } from '../connection';
import { BwSendTransaction } from './types/BwSendTransaction';
import { ParsedTx } from './types/BwTransaction';

let txsSubscriptions: Subscription[] = [];

async function parseTransaction<K>(
  conn: BlockchainConnection,
  trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  address: Address,
): Promise<ParsedTx<any>> {
  if (isFailedTransaction(trans)) {
    throw new Error('Not supported error txs for now');
  }

  if (!isConfirmedTransaction(trans)) {
    throw new Error('Confirmed transaction expected');
  }

  const { transaction: payload } = trans;
  if (isSendTransaction(payload)) {
    const bwSend = new BwSendTransaction();
    const tx = await bwSend.parse(conn, trans as ConfirmedTransaction<SendTransaction>, address);

    return tx;
  }

  return {} as any;
}

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
        const parsedTx = await parseTransaction(connection, tx, address);

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
