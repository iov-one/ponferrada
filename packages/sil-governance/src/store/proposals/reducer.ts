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

export interface ProposalsState {
  readonly proposals: SilProposal[];
  readonly updateRequired: boolean;
}

const initState: ProposalsState = {
  proposals: [],
  updateRequired: false,
};

export interface ReplaceProposalsActionType extends Action {
  type: "@@proposals/REPLACE";
  payload: SilProposal[];
}

export interface RequireUpdateProposalsActionType extends Action {
  type: "@@proposals/REQUIRE_UPDATE";
  payload: boolean;
}

export type ProposalsActions = ActionType<typeof actions>;

export function proposalsReducer(
  state: ProposalsState = initState,
  action: ProposalsActions,
): ProposalsState {
  switch (action.type) {
    case "@@proposals/REPLACE":
      return { proposals: action.payload, updateRequired: false };
    case "@@proposals/REQUIRE_UPDATE":
      return { ...state, updateRequired: action.payload };
    default:
      return state;
  }
}
