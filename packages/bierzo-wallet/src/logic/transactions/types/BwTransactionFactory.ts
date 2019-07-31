import { isSendTransaction } from '@iov/bcp';

import { ParsedTx } from '../types/BwTransaction';
import { BwSendTransaction } from './BwSendTransaction';

export class BwTransactionFactory {
  public static getReactComponent(tx: ParsedTx<any>): JSX.Element {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendTransaction().graphicalRepresentation(tx);
    }

    throw new Error('Not supporting generic components yet');
  }

  public static getCsvRepresentation(tx: ParsedTx<any>): string {
    if (isSendTransaction({ kind: tx.kind })) {
      return new BwSendTransaction().csvRepresentation(tx);
    }

    throw new Error('Not supporting generic components yet');
  }
}
