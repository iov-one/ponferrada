import { Proposal, ProposalStatus, VoteOption } from '@iov/bns';

import { getDummyElectionRules, getDummyProposals, getDummyVote } from './dummyData';
import { AddProposalsActionType, ProposalsState } from './reducer';

export async function getProposals(): Promise<ProposalsState> {
  const electionRules = getDummyElectionRules();
  const proposals = getDummyProposals();

  const getQuorum = (proposal: Proposal): number => {
    const maxVotes = proposal.state.totalElectorateWeight;
    const electionRule = electionRules.find(electionRule => electionRule.id === proposal.electionRule.id);

    let quorum = 0;
    if (electionRule && electionRule.quorum) {
      quorum = Math.ceil((maxVotes * electionRule.quorum.numerator) / electionRule.quorum.denominator);
    }

    return quorum;
  };

  const getThreshold = (proposal: Proposal): number => {
    const totalVotes = proposal.state.totalYes + proposal.state.totalNo + proposal.state.totalAbstain;
    const electionRule = electionRules.find(electionRule => electionRule.id === proposal.electionRule.id);

    let threshold = 0;
    if (electionRule) {
      threshold = Math.ceil(
        (totalVotes * electionRule.threshold.numerator) / electionRule.threshold.denominator,
      );
    }

    return threshold;
  };

  const getVote = (proposal: Proposal): VoteOption | undefined => getDummyVote(proposal);

  const proposalsState = proposals.map(proposal => {
    return {
      id: proposal.id,
      title: proposal.title,
      author: proposal.author,
      description: proposal.description,
      creationDate: new Date(proposal.votingStartTime * 1000),
      expiryDate: new Date(proposal.votingEndTime * 1000),
      quorum: getQuorum(proposal),
      threshold: getThreshold(proposal),
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
  });

  return proposalsState;
}

export const addProposalsAction = (proposals: ProposalsState): AddProposalsActionType => ({
  type: '@@proposals/ADD',
  payload: proposals,
});
