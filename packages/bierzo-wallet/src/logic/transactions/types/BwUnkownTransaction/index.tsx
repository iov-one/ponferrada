import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from '@iov/bcp';
import * as React from 'react';

import { BwParser, ProcessedTx } from '../../types/BwParser';
import UnkownTransactionHeader from './ui/UnknownTxHeader';
import UnkownTransactionRow from './ui/UnknownTxRow';

export interface BwUnknownProps extends ProcessedTx {
  readonly id: string;
}

export class BwUnkownParser extends BwParser<BwUnknownProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    _currentAddress: Address,
  ): Promise<BwUnknownProps> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      kind: 'unknown',
      time,
      id: trans.transactionId,
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
