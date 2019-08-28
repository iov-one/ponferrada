import { Hairline } from "medulas-react-components";
import React from "react";

import Proposal, { ProposalProps } from "./Proposal";

interface Props {
  readonly proposal: ProposalProps;
  readonly index: number;
}

const RenderedProposal = ({ proposal, index }: Props): JSX.Element => {
  if (index === 0) {
    return <Proposal {...proposal} />;
  }

  return (
    <React.Fragment>
      <Hairline />
      <Proposal {...proposal} />
    </React.Fragment>
  );
};

export default RenderedProposal;
