import { createSelector } from 'reselect';

import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { getTransactions } from '../../store/notifications/selectors';

export const confirmedTxSelector = createSelector(
  getTransactions,
  (txs: ReadonlyArray<ParsedTx<{}>>) => {
    const min = Math.min(txs.length, 3);

    return txs.slice(0, min);
  },
);

export const lastTxSelector = createSelector(
  confirmedTxSelector,
  (txs: ReadonlyArray<ParsedTx<{}>>) => {
    if (txs.length === 0) {
      return undefined;
    }

    return txs[0];
  },
);
