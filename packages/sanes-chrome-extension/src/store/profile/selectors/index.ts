import { RootState } from '../../reducers';

export const getUserDB = (state: RootState) => state.user.local.db;
