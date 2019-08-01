import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ParsedTx } from '../../logic/transactions/types/BwParser';

export interface AddTransactionActionType extends Action {
  type: '@@notifications/ADD_TRANSACTION';
  payload: ParsedTx;
}

export const addTransaction = (transaction: ParsedTx): AddTransactionActionType => ({
  type: '@@notifications/ADD_TRANSACTION',
  payload: transaction,
});

export type NotificationActions = ActionType<typeof addTransaction>;
