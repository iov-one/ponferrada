import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from '@iov/bcp';
import * as React from 'react';

import { ProcessedTx } from '../../../../store/notifications';
import { BwParser } from '../../types/BwParser';
import SendTransactionHeader from './ui/SendTxHeader';
import SendTransactionRow from './ui/SendTxRow';

export type BwSendProps = ProcessedTx;

export class BwSendParser extends BwParser<BwSendProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    currentUserAddress: Address,
  ): Promise<BwSendProps> {
    const payload = trans.transaction;

    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    const received = payload.recipient === currentUserAddress;

    return {
      kind: trans.transaction.kind,
      id: trans.transactionId,
      memo: payload.memo,
      amount: payload.amount,
      time,
      received,
      recipient: payload.recipient,
      sender: payload.sender,
    };
  }

  public graphicalRepresentation(sendTx: BwSendProps): JSX.Element {
    return <SendTransactionRow key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: BwSendProps): string {
    const parties = [`"${tx.id}"`, `"${tx.recipient}"`, `"${tx.sender}"`];
    const payment = [
      `"${tx.amount.quantity}"`,
      `"${tx.amount.fractionalDigits}"`,
      `"${tx.amount.tokenTicker}"`,
    ];
    const date = [`"${tx.time.toISOString()}"`];
    const status = [`"${tx.received}"`, `"${tx.memo}"`];

    const txRow = [...parties, ...payment, ...date, ...status];

    return txRow.join(';');
  }

  public headerRepresentation(tx: BwSendProps, lastOne: boolean): JSX.Element {
    return <SendTransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
