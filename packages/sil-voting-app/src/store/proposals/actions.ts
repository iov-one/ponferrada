import { ChainId } from '@iov/bcp';
import { Proposal, ProposalStatus } from '@iov/bns';

import {
  getDummyChainId,
  getDummyElectionRules,
  getDummyElectorates,
  getDummyProposals,
  getDummyVote,
} from './dummyData';
import { AddProposalsActionType, ProposalsState } from './reducer';

export async function getProposals(): Promise<ProposalsState> {
  const electorates = getDummyElectorates();
  const electionRules = getDummyElectionRules();
  const proposals = getDummyProposals();

  const getChainId = (proposal: Proposal): ChainId => getDummyChainId(proposal);

  const getNumElectorates = (proposal: Proposal): number => {
    const electorate = electorates.find(electorate => electorate.id === proposal.electorate.id);

    let numElectorates = 0;
    if (electorate) {
      numElectorates = Object.keys(electorate.electors).length;
    }

    return numElectorates;
  };

  const getQuorum = (proposal: Proposal): number => {
    const numElectorates = getNumElectorates(proposal);
    const electionRule = electionRules.find(electionRule => electionRule.id === proposal.electionRule.id);

    let quorum = 0;
    if (electionRule && electionRule.quorum) {
      quorum = (numElectorates * electionRule.quorum.numerator) / electionRule.quorum.denominator;
    }

    return quorum;
  };

  const getThreshold = (proposal: Proposal): number => {
    const numElectorates = getNumElectorates(proposal);
    const electionRule = electionRules.find(electionRule => electionRule.id === proposal.electionRule.id);

    let threshold = 0;
    if (electionRule) {
      threshold = (numElectorates * electionRule.threshold.numerator) / electionRule.threshold.denominator;
    }

    return threshold;
  };

  const getVote = (proposal: Proposal): 'Invalid' | 'Yes' | 'No' | 'Abstain' => getDummyVote(proposal);

  const getStatus = (proposal: Proposal): 'Active' | 'Submitted' | 'Ended' => {
    if (proposal.status === ProposalStatus.Submitted) {
      if (getVote(proposal) === 'Invalid') {
        return 'Active';
      }

      return 'Submitted';
    }

    return 'Ended';
  };

  const proposalsState = proposals.map(proposal => {
    return {
      chainId: getChainId(proposal),
      proposal: {
        id: proposal.id.toString(),
        title: proposal.title,
        author: proposal.author,
        description: proposal.description,
        creationDate: new Date(proposal.votingStartTime * 1000),
        expiryDate: new Date(proposal.votingEndTime * 1000),
        quorum: getQuorum(proposal),
        threshold: getThreshold(proposal),
        result: {
          yes: proposal.state.totalYes,
          no: proposal.state.totalNo,
          abstain: proposal.state.totalAbstain,
        },
        vote: getVote(proposal),
        status: getStatus(proposal),
      },
    };
  });

  return proposalsState;
}

export const addProposalsAction = (proposals: ProposalsState): AddProposalsActionType => ({
  type: '@@proposals/ADD',
  payload: proposals,
});
