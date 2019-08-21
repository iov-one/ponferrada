import { FormApi } from "final-form";
import { Block, SelectFieldForm, SelectFieldFormItem, Typography } from "medulas-react-components";
import React from "react";

const PROPOSAL_TYPE_FIELD = "Proposal Type";
const PROPOSAL_TYPE_INITIAL = "Select a Proposal Type";

interface Props {
  form: FormApi;
  formOptions: { [key: string]: string };
  proposalType: string;
  handleChange: (item: SelectFieldFormItem) => void;
}

const ProposalTypeField = ({ form, formOptions, proposalType, handleChange }: Props): JSX.Element => {
  const formOptionsItems = Object.values(formOptions).map(formOption => {
    const item: SelectFieldFormItem = {
      name: formOption,
    };

    return item;
  });

  return (
    <Block marginTop={2}>
      <Typography>{PROPOSAL_TYPE_FIELD}</Typography>
      <SelectFieldForm
        fieldName={PROPOSAL_TYPE_FIELD}
        fullWidth
        form={form}
        items={formOptionsItems}
        initial={PROPOSAL_TYPE_INITIAL}
        value={proposalType}
        onChangeCallback={handleChange}
      />
    </Block>
  );
};

export default ProposalTypeField;
