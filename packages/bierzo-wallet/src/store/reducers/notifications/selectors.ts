import { RootState } from '~/reducers';

export const getPendingTransactions = (state: RootState) => state.notification.pending || [];
export const getTransactions = (state: RootState) => state.notification.transaction || [];
