import { ParsedTx } from '../../logic/transactions/BwTransaction';
import { RootState } from '../reducers';
import { Tx } from './reducer';

export const getPendingTransactions = (state: RootState): ReadonlyArray<Tx> =>
  state.notifications.pending || [];
export const getTransactions = (state: RootState): ReadonlyArray<ParsedTx<{}>> =>
  state.notifications.transactions || [];
