import {
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from '@iov/bcp';

import { BwParser, ProcessedTx } from '../types/BwParser';
import { BwSendParser, BwSendProps } from './BwSendTransaction';
import { BwUnknownProps, BwUnkownParser } from './BwUnkownTransaction';

export class BwParserFactory {
  public static getReactComponent(tx: any): JSX.Element {
    if (tx.kind === 'bcp/send') {
      return new BwSendParser().graphicalRepresentation(tx as BwSendProps);
    }

    return new BwUnkownParser().graphicalRepresentation(tx as BwUnknownProps);
  }

  public static getHeaderRepresentation(tx: any, lastOne: boolean): JSX.Element {
    if (tx.kind === 'bcp/send') {
      return new BwSendParser().headerRepresentation(tx as BwSendProps, lastOne);
    }

    return new BwUnkownParser().headerRepresentation(tx as BwUnknownProps, lastOne);
  }

  public static getCsvRepresentation(tx: any): string {
    if (tx.kind === 'bcp/send') {
      return new BwSendParser().csvRepresentation(tx as BwSendProps);
    }

    return new BwUnkownParser().csvRepresentation(tx as BwUnknownProps);
  }

  public static getBwTransactionFrom(
    trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  ): BwParser<ProcessedTx> {
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

    return new BwUnkownParser();
  }
}
