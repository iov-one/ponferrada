import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';

import { balancesReducer, BalanceState } from './balances';
import { extensionReducer, ExtensionState } from './extension';
import { notificationReducer, NotificationState } from './notifications';
import { tokensReducer, TokenState } from './tokens';

export interface RootReducer {
  extension: ExtensionState;
  notifications: NotificationState;
  tokens: TokenState;
  balances: BalanceState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    notifications: notificationReducer,
    tokens: tokensReducer,
    balances: balancesReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;

export default createRootReducer();
