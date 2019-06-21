import { ReadonlyDate } from 'readonly-date';

import { Amount } from '@iov/bcp';

export interface Tx {
  readonly id: string;
  readonly recipient: string;
  readonly signer: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface ProcessedTx extends Tx {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly success: boolean;
  readonly err?: any;
}

export interface NotificationState {
  readonly pending: ReadonlyArray<Tx>;
  readonly transaction: ReadonlyArray<ProcessedTx>;
}
