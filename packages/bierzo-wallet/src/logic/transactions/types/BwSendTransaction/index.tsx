import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from '@iov/bcp';
import * as React from 'react';

import { BwTransaction } from '../../types/BwTransaction';
import SendTransactionComponent, { BwSendTransactionProps } from './ui';

export class BwSendParser extends BwTransaction<SendTransaction, BwSendTransactionProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    currentUserAddress: Address,
  ): Promise<BwSendTransactionProps> {
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
      success: true,
    };
  }

  public graphicalRepresentation(sendTx: BwSendTransactionProps): JSX.Element {
    return <SendTransactionComponent key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: BwSendTransactionProps): string {
    const parties = [`"${tx.id}"`, `"${tx.recipient}"`, `"${tx.sender}"`];
    const payment = [
      `"${tx.amount.quantity}"`,
      `"${tx.amount.fractionalDigits}"`,
      `"${tx.amount.tokenTicker}"`,
    ];
    const date = [`"${tx.time.toISOString()}"`];
    const status = [`"${tx.received}"`, `"${tx.success}"`, `"${tx.err}"`, `"${tx.memo}"`];

    const txRow = [...parties, ...payment, ...date, ...status];

    return txRow.join(';');
  }
}
