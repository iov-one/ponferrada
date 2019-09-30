import { Address } from "@iov/bcp";
import { Block, SelectField, SelectFieldItem, Typography, useForm } from "medulas-react-components";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { ElectionFilter } from "../../../components/AsideFilter";
import { RootState } from "../../../store/reducers";
import Proposal, { ProposalProps } from "./Proposal";

export const PROPOSALS_HTML_ID = "proposals";

const comparatorLabel = "Sort by";

enum ComparatorLabels {
  None = "None",
  ExpiryDate = "Expiry Date",
  StartDate = "Start Date",
  Vote = "Vote",
}

const comparatorItems = Object.values(ComparatorLabels).map(label => {
  return { name: label };
});

const comparatorInitial = comparatorItems[0].name;

type ProposalsFilter = (proposal: ProposalProps) => boolean;

const getFilter = (filterType: ElectionFilter, currentUser: Address | null): ProposalsFilter => {
  const filterByActive: ProposalsFilter = (proposal): boolean => proposal.hasStarted && !proposal.hasEnded;
  const filterByAuthor: ProposalsFilter = (proposal): boolean => proposal.author === currentUser;
  const filterByEnded: ProposalsFilter = (proposal): boolean => proposal.hasEnded;
  const filterNone: ProposalsFilter = (): boolean => true;

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

type ProposalsComparator = (proposal1: ProposalProps, proposal2: ProposalProps) => number;

const compareByIdDescending: ProposalsComparator = (proposal1, proposal2): number => {
  return proposal1.id < proposal2.id ? 1 : -1;
};
const compareByExpiryDate: ProposalsComparator = (proposal1, proposal2): number => {
  return proposal1.expiryDate.getTime() - proposal2.expiryDate.getTime();
};
const compareByStartDate: ProposalsComparator = (proposal1, proposal2): number => {
  return proposal1.startDate.getTime() - proposal2.startDate.getTime();
};
const compareByVote: ProposalsComparator = (proposal1, proposal2): number => {
  if (proposal1.vote === undefined && proposal2.vote === undefined) return 0;
  if (proposal1.vote === undefined) return 1;
  if (proposal2.vote === undefined) return -1;
  return proposal1.vote - proposal2.vote;
};

interface Props {
  readonly filterType: ElectionFilter;
}

const ProposalsList = ({ filterType }: Props): JSX.Element => {
  const proposals = useSelector((state: RootState) => state.proposals.proposals);
  const governor = useSelector((state: RootState) => state.extension.governor);
  const blockchain = useSelector((state: RootState) => state.blockchain);

  const [comparator, setComparator] = useState<ProposalsComparator>(() => compareByIdDescending);

  const changeComparator = (selectedItem: SelectFieldItem): void => {
    switch (selectedItem.name) {
      case ComparatorLabels.ExpiryDate:
        setComparator(() => compareByExpiryDate);
        break;
      case ComparatorLabels.StartDate:
        setComparator(() => compareByStartDate);
        break;
      case ComparatorLabels.Vote:
        setComparator(() => compareByVote);
        break;
      default:
        setComparator(() => compareByIdDescending);
    }
  };

  const { form } = useForm({ onSubmit: () => {} });

  const filter = getFilter(filterType, governor ? governor.address : null);
  const uiProposals = proposals
    .map(
      (proposal): ProposalProps => ({
        ...proposal,
        hasStarted: blockchain.lastBlockTime >= proposal.startDate,
      }),
    )
    .filter(filter)
    .sort(comparator);

  const noProposals = uiProposals.length === 0;

  return (
    <Block id={PROPOSALS_HTML_ID} flexGrow={1}>
      {noProposals && (
        <Block margin={2}>
          <Typography>No proposals available</Typography>
        </Block>
      )}
      {!noProposals && (
        <Block display="flex" alignItems="center" margin={2} height="15px">
          <Typography>{comparatorLabel}</Typography>
          <Block marginLeft={2} width="120px">
            <SelectField
              fieldName={comparatorLabel}
              form={form}
              fullWidth
              items={comparatorItems}
              initial={comparatorInitial}
              onChangeCallback={changeComparator}
            />
          </Block>
        </Block>
      )}
      {uiProposals.map(proposal => (
        <Proposal key={proposal.id} {...proposal} />
      ))}
    </Block>
  );
};

export default ProposalsList;
