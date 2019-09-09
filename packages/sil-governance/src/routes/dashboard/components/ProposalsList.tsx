import { Block, Typography } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { ElectionFilter } from "../../../components/AsideFilter";
import { RootState } from "../../../store/reducers";
import { ProposalProps } from "./Proposal";
import RenderedProposal from "./RenderedProposal";

export const PROPOSALS_HTML_ID = "proposals";

interface Props {
  readonly filterType: ElectionFilter;
}

const getFilter = (filterType: ElectionFilter): { (proposal: ProposalProps): boolean } => {
  const filterByActive = (proposal: ProposalProps): boolean => proposal.hasStarted && !proposal.hasEnded;
  const filterBySubmitted = (proposal: ProposalProps): boolean => !!proposal.vote;
  const filterByEnded = (proposal: ProposalProps): boolean => proposal.hasEnded;
  const filterNone = (_proposal: ProposalProps): boolean => true;

  switch (filterType) {
    case ElectionFilter.Active:
      return filterByActive;
    case ElectionFilter.Submitted:
      return filterBySubmitted;
    case ElectionFilter.Ended:
      return filterByEnded;
    default:
      return filterNone;
  }
};

const ProposalsList = ({ filterType }: Props): JSX.Element => {
  const filter = getFilter(filterType);
  const proposals = ReactRedux.useSelector((state: RootState) => state.proposals).filter(filter);

  const hasProposals = proposals.length > 0;

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {!hasProposals && (
        <Block margin={2}>
          <Typography>No proposals available</Typography>
        </Block>
      )}
      {hasProposals &&
        proposals.map((proposal, index) => (
          <RenderedProposal key={proposal.id} proposal={proposal} index={index} />
        ))}
    </Block>
  );
};

export default ProposalsList;
