import { Address } from "@iov/bcp";
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

const getFilter = (
  filterType: ElectionFilter,
  currentUser: Address | null,
): { (proposal: ProposalProps): boolean } => {
  const filterByActive = (proposal: ProposalProps): boolean => proposal.hasStarted && !proposal.hasEnded;
  const filterByAuthor = (proposal: ProposalProps): boolean => proposal.author === currentUser;
  const filterByEnded = (proposal: ProposalProps): boolean => proposal.hasEnded;
  const filterNone = (_proposal: ProposalProps): boolean => true;

  switch (filterType) {
    case ElectionFilter.Active:
      return filterByActive;
    case ElectionFilter.Authored:
      return filterByAuthor;
    case ElectionFilter.Ended:
      return filterByEnded;
    default:
      return filterNone;
  }
};

const ProposalsList = ({ filterType }: Props): JSX.Element => {
  const proposals = ReactRedux.useSelector((state: RootState) => state.proposals);
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const blockchain = ReactRedux.useSelector((state: RootState) => state.blockchain);

  const filter = getFilter(filterType, governor ? governor.address : null);
  const uiProposals = proposals
    .map(
      (proposal): ProposalProps => ({
        ...proposal,
        hasStarted: blockchain.lastBlockTime >= proposal.startDate,
      }),
    )
    .filter(filter);

  const noProposals = uiProposals.length === 0;

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {noProposals && (
        <Block margin={2}>
          <Typography>No proposals available</Typography>
        </Block>
      )}
      {uiProposals.map((proposal, index) => (
        <RenderedProposal key={proposal.id} proposal={proposal} index={index} />
      ))}
    </Block>
  );
};

export default ProposalsList;
