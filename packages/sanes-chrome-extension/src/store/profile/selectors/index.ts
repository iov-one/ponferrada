import { RootState } from '../../reducers';

export const getUsername = (state: RootState): string => state.user.username;
