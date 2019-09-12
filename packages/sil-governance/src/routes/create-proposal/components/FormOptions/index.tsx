import { ProposalType } from "@iov/bns-governance";
import { FormApi } from "final-form";
import { Block, FieldInputValue } from "medulas-react-components";
import React, { Dispatch, SetStateAction } from "react";

import AddCommitteeMember from "./AddCommitteeMember";
import AddValidator from "./AddValidator";
import AmendCommitteeQuorum from "./AmendCommitteeQuorum";
import AmendCommitteeThreshold from "./AmendCommitteeThreshold";
import AmendProtocol from "./AmendProtocol";
import DistributeFunds, { Recipient } from "./DistributeFunds";
import ReleaseGuaranteeFunds from "./ReleaseGuaranteeFunds";
import RemoveCommitteeMember from "./RemoveCommitteeMember";
import RemoveValidator from "./RemoveValidator";

const proposalOptions = {
  [ProposalType.AmendProtocol]: AmendProtocol,
  [ProposalType.AddCommitteeMember]: AddCommitteeMember,
  [ProposalType.RemoveCommitteeMember]: RemoveCommitteeMember,
  [ProposalType.AmendElectionRuleThreshold]: AmendCommitteeThreshold,
  [ProposalType.AmendElectionRuleQuorum]: AmendCommitteeQuorum,
  [ProposalType.AddValidator]: AddValidator,
  [ProposalType.RemoveValidator]: RemoveValidator,
  [ProposalType.ReleaseGuaranteeFunds]: ReleaseGuaranteeFunds,
  [ProposalType.DistributeFunds]: DistributeFunds,
  [ProposalType.TreasurySend]: Block, // not implemented
};

export const isFraction = (value: FieldInputValue): string | undefined => {
  if (typeof value !== "string") throw new Error("Input must be a string");

  const members = value.split("/");
  const numerator = parseInt(members[0], 10);
  const denominator = parseInt(members[1], 10);

  if (Number.isInteger(numerator) && Number.isInteger(denominator) && numerator <= denominator) {
    return undefined;
  } else {
    return "Must be a valid fraction";
  }
};

interface Props {
  readonly form: FormApi;
  readonly proposalType: ProposalType;
  readonly changeRecipients: Dispatch<SetStateAction<Recipient[]>>;
}

const FormOptions = ({ form, proposalType, changeRecipients }: Props): JSX.Element => {
  const FormComponent = proposalOptions[proposalType];

  return <FormComponent form={form} changeRecipients={changeRecipients} />;
};

export default FormOptions;
