import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { NotificationState, ProcessedTx } from './state';
import { Action } from 'redux';

export type NotificationActions = ActionType<typeof actions>;
const initState: NotificationState = {
  pending: [],
  transaction: [],
};

export interface AddPendingTransactionActionType extends Action {
  type: '@@notifications/ADD_PENDING_TRANSACTION';
  payload: ProcessedTx;
}

export function notificationReducer(
  state: NotificationState = initState,
  action: NotificationActions,
): NotificationState {
  switch (action.type) {
    case '@@notifications/ADD_PENDING_TRANSACTION':
      return {
        ...state,
        pending: [action.payload, ...state.pending],
      };
    default:
      return state;
  }
}
