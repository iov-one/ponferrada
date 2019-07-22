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

function simplifyTransaction(full: AnnotatedConfirmedTransaction): ProcessedTx {
  const {
    time,
    transaction,
    received,
    signerAddr,
    signerName,
    recipientAddr,
    recipientName,
    success,
    transactionId,
    memo,
  } = full;

  const signer = signerName || signerAddr;
  const recipient = recipientName || recipientAddr;

  return {
    id: transactionId,
    time,
    received,
    amount: transaction.amount,
    signer,
    recipient,
    success,
    memo,
  };
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

      // eslint-disable-next-line
      const processedTx = simplifyTransaction(action.payload);
      // eslint-disable-next-line
      const orderedNotifications = [processedTx, ...state.transactions].sort(
        (a: ProcessedTx, b: ProcessedTx) => b.time.getTime() - a.time.getTime(),
      );

      return {
        ...state,
        transactions: orderedNotifications,
      };
    default:
      return state;
  }
}
