import { ProposalType } from "@iov/bns-governance";
import { FormApi } from "final-form";
import React from "react";

import AddCommitteeMember from "./AddCommitteeMember";
import AddValidator from "./AddValidator";
import AmendCommitteeQuorum from "./AmendCommitteeQuorum";
import AmendCommitteeThreshold from "./AmendCommitteeThreshold";
import AmendProtocol from "./AmendProtocol";
import DistributeFunds from "./DistributeFunds";
import ReleaseGuaranteeFunds from "./ReleaseGuaranteeFunds";
import RemoveCommitteeMember from "./RemoveCommitteeMember";
import RemoveValidator from "./RemoveValidator";

interface Props {
  form: FormApi;
  proposalType: ProposalType;
}

const ProposalOptions = ({ form, proposalType }: Props): JSX.Element => {
  return (
    <React.Fragment>
      {proposalType === ProposalType.AmendProtocol && <AmendProtocol form={form} />}
      {proposalType === ProposalType.AddCommitteeMember && <AddCommitteeMember form={form} />}
      {proposalType === ProposalType.RemoveCommitteeMember && <RemoveCommitteeMember form={form} />}
      {proposalType === ProposalType.AmendElectionRuleThreshold && <AmendCommitteeThreshold form={form} />}
      {proposalType === ProposalType.AmendElectionRuleQuorum && <AmendCommitteeQuorum form={form} />}
      {proposalType === ProposalType.AddValidator && <AddValidator form={form} />}
      {proposalType === ProposalType.RemoveValidator && <RemoveValidator form={form} />}
      {proposalType === ProposalType.ReleaseGuaranteeFunds && <ReleaseGuaranteeFunds form={form} />}
      {proposalType === ProposalType.DistributeFunds && <DistributeFunds form={form} />}
    </React.Fragment>
  );
};

export default ProposalOptions;
