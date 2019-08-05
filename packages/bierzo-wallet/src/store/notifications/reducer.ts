import { Amount } from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { NotificationActions } from './actions';

export interface ProcessedSendTransaction extends ParsedTx {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly id: string;
  readonly sender: string;
  readonly recipient: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface NotificationState {
  readonly transactions: ReadonlyArray<ParsedTx>;
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
          (a: ParsedTx, b: ParsedTx) => b.time.getTime() - a.time.getTime(),
        ),
      };
    default:
      return state;
  }
}
