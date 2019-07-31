import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ProposalProps } from '../../routes/dashboard/components/Proposal';
import * as actions from './actions';

export type SilProposal = ProposalProps;

export type ProposalsState = SilProposal[];
const initState: ProposalsState = [];

export interface AddProposalsActionType extends Action {
  type: '@@proposals/ADD';
  payload: ProposalsState;
}

export type ProposalsActions = ActionType<typeof actions>;

export function proposalsReducer(
  state: ProposalsState = initState,
  action: ProposalsActions,
): ProposalsState {
  switch (action.type) {
    case '@@proposals/ADD':
      return [...state, ...action.payload];
    default:
      return state;
  }
}
