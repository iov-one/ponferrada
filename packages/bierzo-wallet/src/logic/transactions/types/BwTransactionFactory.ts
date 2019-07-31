import {
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from '@iov/bcp';

import { BwTransaction, ParsedTx } from '../types/BwTransaction';
import { BwSendParser } from './BwSendTransaction';

export class BwTransactionFactory {
  public static getReactComponent(tx: ParsedTx<any>): JSX.Element {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendParser().graphicalRepresentation(tx);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getCsvRepresentation(tx: ParsedTx<any>): string {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendParser().csvRepresentation(tx);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getBwTransactionFrom(
    trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  ): BwTransaction<ParsedTx<any>> {
    if (isFailedTransaction(trans)) {
      throw new Error('Not supported error txs for now');
    }

    if (!isConfirmedTransaction(trans)) {
      throw new Error('Confirmed transaction expected');
    }

    const { transaction: payload } = trans;
    if (isSendTransaction(payload)) {
      return new BwSendParser();
    }

    throw new Error('Unexpected Tx type');
  }
}
