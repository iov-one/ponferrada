/* eslint-disable no-case-declarations */
import { ReadonlyDate } from 'readonly-date';
import { ActionType } from 'typesafe-actions';
import { AnnotatedConfirmedTransaction } from '~/logic';
import * as logoutActions from '~/store/logout/actions';
import * as actions from './actions';
import { NotificationState, ProcessedTx } from './state';
import { Action } from 'redux';

export type NotificationActions = ActionType<typeof actions & typeof logoutActions>;
const initState: NotificationState = {
  pending: [],
  transaction: [],
};

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ReadonlyArray<ProcessedTx>;
}

// turns the full transaction information into a simple form as needed for display
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
    case 'ADD_PENDING_TRANSACTION':
      return {
        ...state,
        pending: [action.payload, ...state.pending],
      };
    case 'REMOVE_PENDING_TRANSACTION':
      return {
        ...state,
        pending: state.pending.filter(pendingItem => pendingItem.id !== action.payload),
      };
    case 'ADD_FAILED_TRANSACTION':
      const { transaction, err } = action.payload;

      const notification: ProcessedTx = {
        ...transaction,
        time: new ReadonlyDate(),
        received: false,
        success: false,
        err,
      };

      return {
        ...state,
        transaction: [notification, ...state.transaction],
      };
    case 'ADD_CONFIRMED_TRANSACTION':
      if (!action.payload) {
        return state;
      }

      const orderedNotifications = [simplifyTransaction(action.payload), ...state.transaction].sort(
        (a: ProcessedTx, b: ProcessedTx) => b.time.getTime() - a.time.getTime(),
      );
      return {
        ...state,
        transaction: orderedNotifications,
      };
    case 'LOGOUT':
      return { ...initState };
    default:
      return state;
  }
}
