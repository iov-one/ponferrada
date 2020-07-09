import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";

export interface AddTransactionActionType extends Action {
  type: "@@notifications/ADD_TRANSACTION";
  payload: ProcessedTx;
}

export const addTransaction = (transaction: ProcessedTx): AddTransactionActionType => ({
  type: "@@notifications/ADD_TRANSACTION",
  payload: transaction,
});

export type NotificationActions = ActionType<typeof addTransaction>;
