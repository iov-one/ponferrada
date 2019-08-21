import { ProposalType } from "@iov/bns-governance";
import { FormApi } from "final-form";
import { Block, SelectFieldForm, SelectFieldFormItem, Typography } from "medulas-react-components";
import React from "react";

const PROPOSAL_TYPE_FIELD = "Proposal Type";
const PROPOSAL_TYPE_INITIAL = "Amend Protocol";

export const formOptions: { [key: string]: ProposalType } = {
  "Amend Protocol": ProposalType.AmendProtocol,
  "Add Committee Member": ProposalType.AddCommitteeMember,
  "Remove Committee Member": ProposalType.RemoveCommitteeMember,
  "Amend Committee Threshold": ProposalType.AmendElectionRuleThreshold,
  "Amend Committee Quorum": ProposalType.AmendElectionRuleQuorum,
  "Add Validator": ProposalType.AddValidator,
  "Remove Validator": ProposalType.RemoveValidator,
  "Release Guarantee Funds": ProposalType.ReleaseGuaranteeFunds,
  "Distribute Funds": ProposalType.DistributeFunds,
};

const formOptionsItems = Object.keys(formOptions).map(formOption => {
  return {
    name: formOption,
  };
});

interface Props {
  form: FormApi;
  changeProposal: (proposalType: ProposalType) => void;
}

const ProposalTypeSelect = ({ form, changeProposal }: Props): JSX.Element => {
  const handleChange = (item: SelectFieldFormItem): void => changeProposal(formOptions[item.name]);

  return (
    <Block marginTop={2}>
      <Typography>{PROPOSAL_TYPE_FIELD}</Typography>
      <SelectFieldForm
        fieldName={PROPOSAL_TYPE_FIELD}
        fullWidth
        form={form}
        items={formOptionsItems}
        initial={PROPOSAL_TYPE_INITIAL}
        onChangeCallback={handleChange}
      />
    </Block>
  );
};

export default ProposalTypeSelect;
