import { Proposal, ProposalStatus, VoteOption } from "@iov/bns";
import { Governor } from "@iov/bns-governance";

import { getDummyVote } from "./dummyData";
import { AddProposalsActionType, ProposalsState } from "./reducer";

let governor: Governor | undefined;

export const setGovernor = (newGovernor: Governor): void => {
  governor = newGovernor;
};

export async function getProposals(): Promise<ProposalsState> {
  if (!governor) return [];

  const getQuorum = async (proposal: Proposal): Promise<number> => {
    if (!governor) return 0;

    const electionRule = await governor.getElectionRuleById(proposal.electionRule.id);
    const maxVotes = proposal.state.totalElectorateWeight;

    let quorum = 0;
    if (electionRule && electionRule.quorum) {
      quorum = Math.ceil((maxVotes * electionRule.quorum.numerator) / electionRule.quorum.denominator);
    }

    return quorum;
  };

  const getThreshold = async (proposal: Proposal): Promise<number> => {
    if (!governor) return 0;

    const electionRule = await governor.getElectionRuleById(proposal.electionRule.id);
    const totalVotes = proposal.state.totalYes + proposal.state.totalNo + proposal.state.totalAbstain;

    let threshold = 0;
    if (electionRule) {
      threshold = Math.ceil(
        (totalVotes * electionRule.threshold.numerator) / electionRule.threshold.denominator,
      );
    }

    return threshold;
  };

  //TODO Get current vote from blockchain
  const getVote = (proposal: Proposal): VoteOption | undefined => getDummyVote(proposal);

  const proposals = await governor.getProposals();
  const proposalsState = await Promise.all(
    proposals.map(async proposal => {
      return {
        id: proposal.id,
        title: proposal.title,
        author: proposal.author,
        description: proposal.description,
        creationDate: new Date(proposal.votingStartTime * 1000),
        expiryDate: new Date(proposal.votingEndTime * 1000),
        quorum: await getQuorum(proposal),
        threshold: await getThreshold(proposal),
        tally: {
          yes: proposal.state.totalYes,
          no: proposal.state.totalNo,
          abstain: proposal.state.totalAbstain,
          totalVotes: proposal.state.totalYes + proposal.state.totalNo + proposal.state.totalAbstain,
          maxVotes: proposal.state.totalElectorateWeight,
        },
        result: proposal.result,
        vote: getVote(proposal),
        hasEnded: !(proposal.status === ProposalStatus.Submitted),
      };
    }),
  );

  return proposalsState;
}

export const addProposalsAction = (proposals: ProposalsState): AddProposalsActionType => ({
  type: "@@proposals/ADD",
  payload: proposals,
});
