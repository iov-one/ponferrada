import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { RootState } from "../reducers";

export const getTransactions = (state: RootState): ReadonlyArray<ProcessedTx> =>
  state.notifications.transactions || [];
