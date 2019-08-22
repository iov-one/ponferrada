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

const FormOptions = ({ form, proposalType }: Props): JSX.Element => {
  const getCurrentFormOption = (): JSX.Element => {
    switch (proposalType) {
      case ProposalType.AmendProtocol:
        return <AmendProtocol form={form} />;
      case ProposalType.AddCommitteeMember:
        return <AddCommitteeMember form={form} />;
      case ProposalType.RemoveCommitteeMember:
        return <RemoveCommitteeMember form={form} />;
      case ProposalType.AmendElectionRuleThreshold:
        return <AmendCommitteeThreshold form={form} />;
      case ProposalType.AmendElectionRuleQuorum:
        return <AmendCommitteeQuorum form={form} />;
      case ProposalType.AddValidator:
        return <AddValidator form={form} />;
      case ProposalType.RemoveValidator:
        return <RemoveValidator form={form} />;
      case ProposalType.ReleaseGuaranteeFunds:
        return <ReleaseGuaranteeFunds form={form} />;
      case ProposalType.DistributeFunds:
        return <DistributeFunds form={form} />;
    }
  };

  return <React.Fragment>{getCurrentFormOption()}</React.Fragment>;
};

export default FormOptions;
