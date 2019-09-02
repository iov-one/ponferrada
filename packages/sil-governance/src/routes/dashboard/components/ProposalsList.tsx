import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../store/reducers";
import RenderedProposal from "./RenderedProposal";

export const PROPOSALS_HTML_ID = "proposals";

const ProposalsList = (): JSX.Element => {
  const proposals = ReactRedux.useSelector((state: RootState) => state.proposals);

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {proposals.map((proposal, index) => (
        <RenderedProposal key={proposal.id} proposal={proposal} index={index} />
      ))}
    </Block>
  );
};

export default ProposalsList;
