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
import { BnsConnection } from '@iov/bns';
import { TransactionEncoder } from '@iov/core';
import { Dispatch } from 'redux';
import { Subscription } from 'xstream';

import { getConfig } from '../config';
import { addConfirmedTransaction, ProcessedTx } from '../store/notifications';
import { getUsernameFrom } from '../store/usernames';
import { getCodec } from './codec';
import { getConnectionFor, isBnsSpec } from './connection';

let txsSubscriptions: Subscription[] = [];

export const parseConfirmedTransaction = async <T extends LightTransaction>(
  bnsConn: BnsConnection,
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

  // we look up names from the bns chain
  const chainId = conn.chainId();
  const recipientAddr = payload.recipient;
  const recipientName = await getUsernameFrom(bnsConn, chainId, recipientAddr);
  const recipient = recipientName || recipientAddr;

  const creatorPubkey = trans.primarySignature.pubkey;
  const creator: Identity = {
    chainId: chainId,
    pubkey: creatorPubkey,
  };
  const signerAddr = codec.identityToAddress(creator);
  const signerName = await getUsernameFrom(bnsConn, chainId, signerAddr);

  const signer = signerName || signerAddr;

  return {
    id: trans.transactionId,
    memo: payload.memo,
    amount: payload.amount,
    time,
    received,
    recipient,
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

  const bnsSpec = config.chains.find(chain => isBnsSpec(chain.chainSpec));
  if (!bnsSpec) {
    throw new Error('For subscribing to transactions we need a BNS connection');
  }
  const bnsConnection: BnsConnection = (await getConnectionFor(bnsSpec.chainSpec)) as BnsConnection;

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

        const proccesedTx = await parseConfirmedTransaction(bnsConnection, connection, tx, identity, codec);
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
