import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { RootState } from '../reducers';
import { Tx } from './reducer';

export const getPendingTransactions = (state: RootState): ReadonlyArray<Tx> =>
  state.notifications.pending || [];
export const getTransactions = (state: RootState): ReadonlyArray<ParsedTx<{}>> =>
  state.notifications.transactions || [];
