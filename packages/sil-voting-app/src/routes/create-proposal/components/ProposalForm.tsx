import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Form, { useForm } from 'medulas-react-components/lib/components/forms/Form';
import { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';

import DescriptionField from './DescriptionField';
import ParticipationData from './ParticipationData';
import FormOptions from './ProposalOptions';
import ProposalTypeField from './ProposalTypeField';
import TitleField from './TitleField';
import WhenField from './WhenField';

const formOptions = {
  addCommitteeMember: 'Add Committee Member',
  removeCommitteeMember: 'Remove Committee Member',
  amendCommitteeThreshold: 'Amend Committee Threshold',
  amendCommitteeQuorum: 'Amend Committee Quorum',
  releaseGuaranteeFunds: 'Release Guarantee Funds',
  distributeFunds: 'Distribute Funds',
  addValidator: 'Add Validator',
  removeValidator: 'Remove Validator',
  amendProtocol: 'Amend Blockchain Software',
};

const onSubmit = (): void => {};

const ProposalForm = (): JSX.Element => {
  const [proposalType, setProposalType] = useState('');

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  const handleChange = (item: Item): void => {
    setProposalType(item.name);
  };

  return (
    <Block flexGrow={1} margin={2}>
      <Typography>Create Proposal</Typography>
      <Form onSubmit={handleSubmit}>
        <ProposalTypeField
          form={form}
          formOptions={formOptions}
          proposalType={proposalType}
          handleChange={handleChange}
        />
        <Block display="flex" justifyContent="space-between" marginTop={2}>
          <TitleField form={form} />
          <WhenField form={form} />
        </Block>
        <FormOptions proposalType={proposalType} formOptions={formOptions} form={form} />
        <DescriptionField form={form} />
        <ParticipationData />
        <Block display="flex" justifyContent="flex-end" marginTop={2}>
          <Button type="submit" disabled={invalid || pristine || submitting}>
            Publish
          </Button>
        </Block>
      </Form>
    </Block>
  );
};

export default ProposalForm;
