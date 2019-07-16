import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import React from 'react';
import * as ReactRedux from 'react-redux';

import { RootState } from '../../../store/reducers';
import { ProposalsState } from '../../../store/reducers/proposals';
import Proposal from './Proposal';

export const PROPOSALS_HTML_ID = 'proposals';

const renderProposals = (storedProposals: ProposalsState): JSX.Element[] => {
  const proposals = Object.values(storedProposals).map(state => {
    return state.proposal;
  });

  return proposals.map((_, index) => {
    if (index === 0) {
      return <React.Fragment key={index}>{Proposal(proposals[index])}</React.Fragment>;
    }

    return (
      <React.Fragment key={index}>
        <Hairline />
        {Proposal(proposals[index])}
      </React.Fragment>
    );
  });
};

const ProposalsList = (): JSX.Element => {
  const storedProposals = ReactRedux.useSelector((state: RootState) => state.proposals);
  const renderedProposals = renderProposals(storedProposals);

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {renderedProposals}
    </Block>
  );
};

export default ProposalsList;
