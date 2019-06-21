import { combineReducers, Reducer } from 'redux';
import { StateType } from 'typesafe-actions';
import { extensionReducer, ExtensionState } from './extension';
import { notificationReducer, NotificationState } from './notifications';

export interface RootReducer {
  extension: ExtensionState;
  notifications: NotificationState;
}

const createRootReducer = (): Reducer<RootReducer> =>
  combineReducers({
    extension: extensionReducer,
    notifications: notificationReducer,
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;

export default createRootReducer();
