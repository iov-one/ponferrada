import { TransactionId } from "@iov/bcp";

import { SetTransactionsStateActionType } from "./reducer";

export const setTransactionsStateAction = (
  lastSignAndPostResult?: TransactionId | null,
): SetTransactionsStateActionType => ({
  type: "@@transactions/SET_STATE",
  payload: { lastSignAndPostResult },
});
