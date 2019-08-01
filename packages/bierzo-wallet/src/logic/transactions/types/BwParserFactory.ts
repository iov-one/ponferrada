import {
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from '@iov/bcp';

import { BwParser, ParsedTx } from '../types/BwParser';
import { BwSendParser } from './BwSendTransaction';
import { BwSendProps } from './BwSendTransaction';

export class BwParserFactory {
  public static getReactComponent(tx: any): JSX.Element {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendParser().graphicalRepresentation(tx as BwSendProps);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getHeaderRepresentation(tx: any, lastOne: boolean): JSX.Element {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendParser().headerRepresentation(tx as BwSendProps, lastOne);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getCsvRepresentation(tx: any): string {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendParser().csvRepresentation(tx as BwSendProps);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getBwTransactionFrom(
    trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  ): BwParser<ParsedTx> {
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
