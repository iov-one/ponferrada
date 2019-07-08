import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ProcessedTx } from './reducer';

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ProcessedTx;
}

export const addPendingTransactionAction = (transaction: ProcessedTx): AddPendingTransactionActionType => ({
  type: '@@notifications/ADD_PENDING_TRANSACTION',
  payload: transaction,
});

export type NotificationActions = ActionType<typeof addPendingTransactionAction>;
