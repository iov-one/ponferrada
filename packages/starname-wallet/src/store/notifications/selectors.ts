import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { RootState } from "../reducers";

export function getTransactions(state: RootState): readonly ProcessedTx[] {
  return state.notifications.transactions || [];
}

export function confirmedTxSelector(state: RootState): readonly ProcessedTx[] {
  const txs = getTransactions(state);
  const min = Math.min(txs.length, 3);

  return txs.slice(0, min);
}

export function lastTxSelector(state: RootState): ProcessedTx | undefined {
  const txs = confirmedTxSelector(state);
  if (txs.length === 0) {
    return undefined;
  }

  return txs[0];
}
