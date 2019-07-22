import { Amount, ChainId, ConfirmedTransaction, SendTransaction, UnsignedTransaction } from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

import { NotificationActions } from './actions';

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
  readonly transactions: ReadonlyArray<ProcessedTx>;
}

const initState: NotificationState = {
  pending: [],
  transactions: [],
};

export interface AnnotatedConfirmedTransaction<
  T extends Omit<UnsignedTransaction, 'creator'> = SendTransaction
> extends ConfirmedTransaction<T> {
  readonly received: boolean;
  readonly time: ReadonlyDate;
  readonly success: boolean;
  // these are always set to the raw values (TODO: handle multisig)
  readonly signerAddr: string;
  readonly recipientAddr: string;
  // these are set for reverse lookup of valuename
  readonly signerName?: string;
  readonly recipientName?: string;
  readonly chainId: ChainId;
  readonly memo?: string;
}

export function notificationReducer(
  state: NotificationState = initState,
  action: NotificationActions,
): NotificationState {
  switch (action.type) {
    case '@@notifications/ADD_PENDING_TRANSACTION':
      return {
        ...state,
        pending: [action.payload, ...state.pending],
      };
    case '@@notifications/ADD_CONFIRMED_TRANSACTION':
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        transactions: [action.payload, ...state.transactions].sort(
          (a: ProcessedTx, b: ProcessedTx) => b.time.getTime() - a.time.getTime(),
        ),
      };
    default:
      return state;
  }
}
