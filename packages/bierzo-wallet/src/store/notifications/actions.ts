import { ProcessedTx } from './state';
import { AddPendingTransactionActionType } from './reducer';

export const addPendingTransactionAction = (transaction: ProcessedTx): AddPendingTransactionActionType => ({
  type: '@@notifications/ADD_PENDING_TRANSACTION',
  payload: transaction,
});
