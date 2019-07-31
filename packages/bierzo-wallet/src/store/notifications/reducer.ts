import { Amount } from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

import { ParsedTx } from '../../logic/transactions/BwTransaction';
import { NotificationActions } from './actions';

export interface Tx {
  readonly id: string;
  readonly sender: string;
  readonly recipient: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface ProcessedTx extends Tx {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly success: boolean;
  readonly err?: any;
}

export interface NotificationState<K> {
  readonly pending: ReadonlyArray<Tx>;
  readonly transactions: ReadonlyArray<ParsedTx<K>>;
}

const initState = {
  pending: [],
  transactions: [],
};

export function notificationReducer(
  state: NotificationState<any> = initState,
  action: NotificationActions,
): NotificationState<any> {
  switch (action.type) {
    case '@@notifications/ADD_PENDING_TRANSACTION':
      return {
        ...state,
        pending: [action.payload, ...state.pending],
      };
    case '@@notifications/ADD_TRANSACTION':
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        transactions: [action.payload as ParsedTx<any>, ...state.transactions].sort(
          <T>(a: ParsedTx<T>, b: ParsedTx<T>) => b.time.getTime() - a.time.getTime(),
        ),
      };
    default:
      return state;
  }
}
