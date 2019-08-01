import { Amount } from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

import { ParsedTx } from '../../logic/transactions/types/BwParser';
import { NotificationActions } from './actions';

export interface ProcessedTx extends ParsedTx {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly success: boolean;
  readonly id: string;
  readonly sender: string;
  readonly recipient: string;
  readonly amount: Amount;
  readonly memo?: string;
  readonly err?: any;
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
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        transactions: [action.payload as ParsedTx, ...state.transactions].sort(
          (a: ParsedTx, b: ParsedTx) => b.time.getTime() - a.time.getTime(),
        ),
      };
    default:
      return state;
  }
}
