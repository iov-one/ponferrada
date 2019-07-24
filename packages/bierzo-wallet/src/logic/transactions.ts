import {
  BlockchainConnection,
  ConfirmedTransaction,
  Identity,
  isConfirmedTransaction,
  isSendTransaction,
  LightTransaction,
  pubkeyBundleEquals,
  TxCodec,
} from '@iov/bcp';
import { TransactionEncoder } from '@iov/encoding';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../config';
import { addConfirmedTransaction, ProcessedTx } from '../store/notifications';
import { getCodec } from './codec';
import { getConnectionFor } from './connection';

let txsSubscriptions: Subscription[] = [];

export const parseConfirmedTransaction = async <T extends LightTransaction>(
  conn: BlockchainConnection,
  trans: ConfirmedTransaction<T>,
  identity: Identity,
  codec: TxCodec,
): Promise<ProcessedTx | undefined> => {
  const payload = trans.transaction;
  if (!isSendTransaction(payload)) {
    console.log(`Only handle SendTransaction for now, got ${payload.kind}`);
    return undefined;
  }

  const header = await conn.getBlockHeader(trans.height);
  const time = header.time;

  const received = !pubkeyBundleEquals(trans.primarySignature.pubkey, identity.pubkey);

  const creatorPubkey = trans.primarySignature.pubkey;
  const creator: Identity = {
    chainId: conn.chainId(),
    pubkey: creatorPubkey,
  };
  const signer = codec.identityToAddress(creator);

  return {
    id: trans.transactionId,
    memo: payload.memo,
    amount: payload.amount,
    time,
    received,
    recipient: payload.recipient,
    signer,
    success: true,
  };
};

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

        // Here once we support more tx types we need to find a solution for separating
        // common attributes from specific attributes
        const proccesedTx = await parseConfirmedTransaction(connection, tx, identity, codec);
        if (!proccesedTx) {
          return;
        }

        await dispatch(addConfirmedTransaction(proccesedTx));
      },
    });
    txsSubscriptions.push(subscription);
  }
}

export function unsubscribeTransactions(): void {
  txsSubscriptions.forEach(subs => subs.unsubscribe());
  txsSubscriptions = [];
}
