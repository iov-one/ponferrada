import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { ProcessedTx } from './reducer';

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ProcessedTx;
}

export const addPendingTransactionAction = (transaction: ProcessedTx): AddPendingTransactionActionType => ({
  type: '@@notifications/ADD_PENDING_TRANSACTION',
  payload: transaction,
});

export interface AddTransactionActionType<T> extends Action {
  type: '@@notifications/ADD_TRANSACTION';
  payload: ParsedTx;
}

export const addTransaction = <T>(transaction: ParsedTx): AddTransactionActionType<T> => ({
  type: '@@notifications/ADD_TRANSACTION',
  payload: transaction,
});

export type NotificationActions = ActionType<typeof addPendingTransactionAction | typeof addTransaction>;
