import { Address } from "@iov/bcp";
import { ProposalAction, ProposalResult, VoteOption } from "@iov/bns";
import { ReadonlyDate } from "readonly-date";
import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export interface Tally {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly totalVotes: number;
  readonly maxVotes: number;
}

export interface SilProposal {
  readonly id: number;
  readonly title: string;
  readonly action: ProposalAction;
  readonly author: Address;
  readonly description: string;
  readonly startDate: ReadonlyDate;
  readonly expiryDate: ReadonlyDate;
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
  readonly result: ProposalResult;
  readonly vote: VoteOption | undefined;
  readonly hasEnded: boolean;
}

export type ProposalsState = SilProposal[];
const initState: ProposalsState = [];

export interface ReplaceProposalsActionType extends Action {
  type: "@@proposals/REPLACE";
  payload: ProposalsState;
}

export type ProposalsActions = ActionType<typeof actions>;

export function proposalsReducer(
  state: ProposalsState = initState,
  action: ProposalsActions,
): ProposalsState {
  switch (action.type) {
    case "@@proposals/REPLACE":
      return [...action.payload];
    default:
      return state;
  }
}
