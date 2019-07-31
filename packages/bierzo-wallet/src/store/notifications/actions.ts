import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ParsedTx } from '../../logic/transactions/types/BwTransaction';
import { ProcessedTx } from './reducer';

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ProcessedTx;
}

export const addPendingTransactionAction = (transaction: ProcessedTx): AddPendingTransactionActionType => ({
  type: '@@notifications/ADD_PENDING_TRANSACTION',
  payload: transaction,
});

export interface AddTransactionActionType extends Action {
  type: '@@notifications/ADD_TRANSACTION';
  payload: ParsedTx<any>;
}

export const addTransaction = (transaction: ParsedTx<any>): AddTransactionActionType => ({
  type: '@@notifications/ADD_TRANSACTION',
  payload: transaction,
});

export type NotificationActions = ActionType<typeof addPendingTransactionAction | typeof addTransaction>;
