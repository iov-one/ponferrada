import { Amount } from '@iov/bcp';

import { ProcessedTx } from '../../logic/transactions/types/BwParser';
import { NotificationActions } from './actions';

export interface ProcessedSendTransaction extends ProcessedTx {
  readonly received: boolean;
  readonly sender: string;
  readonly recipient: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface NotificationState {
  readonly transactions: ReadonlyArray<ProcessedTx>;
}

const initState = {
  transactions: [],
};

export function notificationReducer(
  state: NotificationState = initState,
  action: NotificationActions,
): NotificationState {
  switch (action.type) {
    case '@@notifications/ADD_TRANSACTION':
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
