import { Proposal, ProposalStatus, VoteOption } from "@iov/bns";
import { Governor } from "@iov/bns-governance";

import { AddProposalsActionType, ProposalsState } from "./reducer";

export async function getProposals(governor: Governor): Promise<ProposalsState> {
  const getQuorum = async (proposal: Proposal): Promise<number> => {
    const electionRule = await governor.getElectionRuleById(proposal.electionRule.id);
    const maxVotes = proposal.state.totalElectorateWeight;

    let quorum = 0;
    if (electionRule && electionRule.quorum) {
      quorum = Math.ceil((maxVotes * electionRule.quorum.numerator) / electionRule.quorum.denominator);
    }

    return quorum;
  };

  const getThreshold = async (proposal: Proposal): Promise<number> => {
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

  const getVote = async (proposal: Proposal): Promise<VoteOption | undefined> => {
    const votes = await governor.getVotes();
    if (!votes) return undefined;

    const vote = votes.find(vote => vote.proposalId === proposal.id);
    if (!vote) return undefined;

    return vote.selection;
  };

  const proposals = await governor.getProposals();
  const proposalsState = await Promise.all(
    proposals.map(async proposal => {
      const startDate = new Date(proposal.votingStartTime * 1000);

      return {
        id: proposal.id,
        action: proposal.action,
        title: proposal.title,
        author: proposal.author,
        description: proposal.description,
        startDate,
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
        vote: await getVote(proposal),
        hasStarted: startDate < new Date(),
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
