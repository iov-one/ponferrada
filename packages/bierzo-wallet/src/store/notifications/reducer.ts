import { SendTransaction } from "@iov/bcp";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { NotificationActions } from "./actions";

export interface ProcessedSendTransaction extends ProcessedTx<SendTransaction> {
  /** the current user is the receiver of the token send transaction */
  readonly incoming: boolean;
  /** the current user is the sender of the token send transaction */
  readonly outgoing: boolean;
}

export interface NotificationState {
  readonly transactions: readonly ProcessedTx[];
}

const initState = {
  transactions: [],
};

export function notificationReducer(
  state: NotificationState = initState,
  action: NotificationActions,
): NotificationState {
  switch (action.type) {
    case "@@notifications/ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].sort(
          (a: ProcessedTx, b: ProcessedTx) => b.time.getTime() - a.time.getTime(),
        ),
      };
    default:
      return state;
  }
}
