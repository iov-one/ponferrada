import { ProposalType } from "@iov/bns-governance";
import { FormApi } from "final-form";
import { Block, SelectFieldForm, Typography } from "medulas-react-components";
import React, { Dispatch, SetStateAction } from "react";

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
  changeProposalType: Dispatch<SetStateAction<ProposalType>>;
}

const ProposalTypeSelect = ({ form, changeProposalType }: Props): JSX.Element => {
  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{PROPOSAL_TYPE_FIELD}</Typography>
      <Block marginLeft={2}>
        <SelectFieldForm
          fieldName={PROPOSAL_TYPE_FIELD}
          fullWidth
          form={form}
          items={formOptionsItems}
          initial={PROPOSAL_TYPE_INITIAL}
          onChangeCallback={selectedItem => changeProposalType(formOptions[selectedItem.name])}
        />
      </Block>
    </Block>
  );
};

export default ProposalTypeSelect;
