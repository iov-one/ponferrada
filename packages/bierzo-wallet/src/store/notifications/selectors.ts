import { RootState } from '../reducers';
import { ProcessedTx, Tx } from './reducer';

export const getPendingTransactions = (state: RootState): ReadonlyArray<Tx> =>
  state.notifications.pending || [];
export const getTransactions = (state: RootState): ReadonlyArray<ProcessedTx> =>
  state.notifications.transactions || [];
