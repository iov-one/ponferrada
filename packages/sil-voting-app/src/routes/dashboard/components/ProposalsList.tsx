import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { RootState } from '../../../store/reducers';
import RenderedProposal from './Proposal/RenderedProposal';

export const PROPOSALS_HTML_ID = 'proposals';

const ProposalsList = (): JSX.Element => {
  const storedProposals = ReactRedux.useSelector((state: RootState) => state.proposals);
  const proposals = Object.values(storedProposals).map(state => state.proposal);

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {proposals.map((proposal, index) => (
        <RenderedProposal key={proposal.id} proposal={proposal} index={index} />
      ))}
    </Block>
  );
};

export default ProposalsList;
