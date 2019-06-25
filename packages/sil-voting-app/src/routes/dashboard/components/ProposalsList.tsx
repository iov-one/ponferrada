import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';
import Proposal from './Proposal';

const ProposalsList = (): JSX.Element => {
  const proposals = [
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
    Proposal(),
  ];

  return <Block>{proposals}</Block>;
};

export default ProposalsList;
