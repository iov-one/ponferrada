import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from '@iov/bcp';
import * as React from 'react';

import { BwParser, ParsedTx } from '../../types/BwParser';
import UnkownTransactionHeader from './ui/UnknownTxHeader';
import UnkownTransactionRow from './ui/UnknownTxRow';

export interface BwUnknownProps extends ParsedTx {
  readonly id: string;
  readonly received: boolean;
}

export class BwUnkownParser extends BwParser<BwUnknownProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    currentUserAddress: Address,
  ): Promise<BwUnknownProps> {
    const payload = trans.transaction;

    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    const received = payload.recipient === currentUserAddress;

    return {
      kind: 'unknown',
      time,
      id: trans.transactionId,
      received,
    };
  }

  public graphicalRepresentation(tx: BwUnknownProps): JSX.Element {
    return <UnkownTransactionRow key={tx.id} tx={tx} />;
  }

  public csvRepresentation(tx: BwUnknownProps): string {
    return '';
  }

  public headerRepresentation(tx: BwUnknownProps, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
