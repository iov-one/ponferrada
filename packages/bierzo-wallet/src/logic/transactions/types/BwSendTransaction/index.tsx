import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from '@iov/bcp';
import * as React from 'react';

import { ProcessedSendTransaction } from '../../../../store/notifications';
import { BwParser } from '../../types/BwParser';
import SendTransactionHeader from './ui/SendTxHeader';
import SendTransactionRow from './ui/SendTxRow';

export type BwSendProps = ProcessedSendTransaction;

export class BwSendParser extends BwParser<BwSendProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    currentUserAddress: Address,
  ): Promise<BwSendProps> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    const received = trans.transaction.recipient === currentUserAddress;

    return {
      id: trans.transactionId,
      time,
      received,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(sendTx: BwSendProps): JSX.Element {
    return <SendTransactionRow key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: BwSendProps): string {
    const { original } = tx;
    const parties = [`"${tx.id}"`, `"${original.recipient}"`, `"${original.sender}"`];
    const payment = [
      `"${original.amount.quantity}"`,
      `"${original.amount.fractionalDigits}"`,
      `"${original.amount.tokenTicker}"`,
    ];
    const date = [`"${tx.time.toISOString()}"`];
    const status = [`"${tx.received}"`, `"${original.memo}"`];

    const txRow = [...parties, ...payment, ...date, ...status];

    return txRow.join(';');
  }

  public headerRepresentation(tx: BwSendProps, lastOne: boolean): JSX.Element {
    return <SendTransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
