import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { RootState } from '../reducers';

export const getTransactions = (state: RootState): ReadonlyArray<ParsedTx> =>
  state.notifications.transactions || [];
