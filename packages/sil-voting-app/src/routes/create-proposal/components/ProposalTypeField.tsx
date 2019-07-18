import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import SelectFieldForm, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const PROPOSAL_TYPE_FIELD = 'Proposal Type';
const PROPOSAL_TYPE_INITIAL = 'Select a Proposal Type';

interface Props {
  form: FormApi;
  formOptions: { [key: string]: string };
  proposalType: string;
  handleChange: (item: Item) => void;
}

const ProposalTypeField = ({ form, formOptions, proposalType, handleChange }: Props): JSX.Element => {
  const formOptionsItems = Object.values(formOptions).map(formOption => {
    const item: Item = {
      name: formOption,
    };

    return item;
  });

  return (
    <Block>
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
