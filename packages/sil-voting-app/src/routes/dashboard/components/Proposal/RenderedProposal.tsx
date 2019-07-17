import Hairline from 'medulas-react-components/lib/components/Hairline';
import React from 'react';

import Proposal, { ProposalProps } from '.';

interface Props {
  readonly proposal: ProposalProps;
  readonly index: number;
}

const RenderedProposal = (props: Props): JSX.Element => {
  if (props.index === 0) {
    return <React.Fragment key={props.index}>{Proposal(props.proposal)}</React.Fragment>;
  }

  return (
    <React.Fragment key={props.index}>
      <Hairline />
      {Proposal(props.proposal)}
    </React.Fragment>
  );
};

export default RenderedProposal;
