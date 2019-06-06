import { ThunkDispatch } from 'redux-thunk';

import { RootActions, RootState } from '../store/reducers';

export type RootThunkDispatch = ThunkDispatch<RootState, any, RootActions>;
