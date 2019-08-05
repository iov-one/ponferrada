import { createSelector } from "reselect";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { getTransactions } from "../../store/notifications/selectors";

export const confirmedTxSelector = createSelector(
  getTransactions,
  (txs: ReadonlyArray<ProcessedTx>) => {
    const min = Math.min(txs.length, 3);

    return txs.slice(0, min);
  },
);

export const lastTxSelector = createSelector(
  confirmedTxSelector,
  (txs: ReadonlyArray<ProcessedTx>) => {
    if (txs.length === 0) {
      return undefined;
    }

    return txs[0];
  },
);
