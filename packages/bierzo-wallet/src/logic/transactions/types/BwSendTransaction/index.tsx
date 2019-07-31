import {
  BlockchainConnection,
  ConfirmedTransaction,
  Identity,
  pubkeyBundleEquals,
  SendTransaction,
  TxCodec,
} from '@iov/bcp';
import * as React from 'react';

import { BwTransaction } from '../../BwTransaction';
import SendTransactionComponent, { BwSendTransactionProps } from './ui';

export class BwSendTransaction extends BwTransaction<SendTransaction, BwSendTransactionProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    identity: Identity,
    codec: TxCodec,
  ): Promise<BwSendTransactionProps> {
    const payload = trans.transaction;

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
      kind: trans.transaction.kind,
      id: trans.transactionId,
      memo: payload.memo,
      amount: payload.amount,
      time,
      received,
      recipient: payload.recipient,
      signer,
      success: true,
    };
  }

  public graphicalRepresentation(sendTx: BwSendTransactionProps): JSX.Element {
    return <SendTransactionComponent key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: BwSendTransactionProps): string {
    const parties = `"${tx.id}";"${tx.recipient}";"${tx.signer}";`;
    const payment = `"${tx.amount.quantity}";"${tx.amount.fractionalDigits}";"${tx.amount.tokenTicker}";`;
    const date = `"${tx.time.toISOString()}";`;
    const status = `"${tx.received}";"${tx.success}";"${tx.err}";"${tx.memo}"`;

    const txRow = `${parties}${payment}${date}${status}`;

    return txRow;
  }
}
