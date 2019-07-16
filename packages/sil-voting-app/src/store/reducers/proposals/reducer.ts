import { Action } from 'redux';
import { ActionType } from 'typesafe-actions';

import { ProposalProps } from '../../../routes/dashboard/components/Proposal';
import * as actions from './actions';

export interface SilProposal {
  // Use ChainId type when governance API is integrated
  readonly chainId: string;
  readonly proposal: ProposalProps;
}

export interface AddProposalsActionType extends Action {
  type: '@@proposals/ADD';
  payload: { [key: string]: SilProposal };
}

export type ProposalsActions = ActionType<typeof actions>;

export interface ProposalsState {
  [key: string]: SilProposal;
}
const initState: ProposalsState = {};

export function proposalsReducer(
  state: ProposalsState = initState,
  action: ProposalsActions,
): ProposalsState {
  switch (action.type) {
    case '@@proposals/ADD':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
