import { FormApi } from 'final-form';
import React from 'react';

import AddCommitteeMember from './AddCommitteeMember';
import AddValidator from './AddValidator';
import AmendCommitteeQuorum from './AmendCommitteeQuorum';
import AmendCommitteeThreshold from './AmendCommitteeThreshold';
import AmendProtocol from './AmendProtocol';
import DistributeFunds from './DistributeFunds';
import ReleaseGuaranteeFunds from './ReleaseGuaranteeFunds';
import RemoveCommitteeMember from './RemoveCommitteeMember';
import RemoveValidator from './RemoveValidator';

interface Props {
  proposalType: string;
  formOptions: { [key: string]: string };
  form: FormApi;
}

const ProposalOptions = ({ proposalType, formOptions, form }: Props): JSX.Element => {
  return (
    <React.Fragment>
      {proposalType === formOptions.addCommitteeMember && <AddCommitteeMember form={form} />}
      {proposalType === formOptions.removeCommitteeMember && <RemoveCommitteeMember form={form} />}
      {proposalType === formOptions.amendCommitteeThreshold && <AmendCommitteeThreshold form={form} />}
      {proposalType === formOptions.amendCommitteeQuorum && <AmendCommitteeQuorum form={form} />}
      {proposalType === formOptions.releaseGuaranteeFunds && <ReleaseGuaranteeFunds form={form} />}
      {proposalType === formOptions.distributeFunds && <DistributeFunds form={form} />}
      {proposalType === formOptions.addValidator && <AddValidator form={form} />}
      {proposalType === formOptions.removeValidator && <RemoveValidator form={form} />}
      {proposalType === formOptions.amendProtocol && <AmendProtocol form={form} />}
    </React.Fragment>
  );
};

export default ProposalOptions;
