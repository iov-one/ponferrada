import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { AnnotatedConfirmedTransaction, ProcessedTx } from './reducer';

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ProcessedTx;
}

export const addPendingTransactionAction = (transaction: ProcessedTx): AddPendingTransactionActionType => ({
  type: '@@notifications/ADD_PENDING_TRANSACTION',
  payload: transaction,
});

export interface AddConfirmedTransactionActionType extends Action {
  type: '@@notifications/ADD_CONFIRMED_TRANSACTION';
  payload: AnnotatedConfirmedTransaction;
}

export const addConfirmedTransaction = (
  transaction: AnnotatedConfirmedTransaction,
): AddConfirmedTransactionActionType => ({
  type: '@@notifications/ADD_CONFIRMED_TRANSACTION',
  payload: transaction,
});

export type NotificationActions = ActionType<
  typeof addPendingTransactionAction | typeof addConfirmedTransaction
>;
