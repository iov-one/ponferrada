import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { RootState } from "../reducers";

export const getTransactions = (state: RootState): readonly ProcessedTx[] =>
  state.notifications.transactions || [];
