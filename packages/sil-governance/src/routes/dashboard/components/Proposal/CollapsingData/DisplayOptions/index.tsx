import { ActionKind, ProposalAction } from "@iov/bns";
import React from "react";

import CreateTextResolution from "./CreateTextResolution";
import ExecuteProposalBatch from "./ExecuteProposalBatch";
import GenericProposal from "./GenericProposal";
import ReleaseEscrow from "./ReleaseEscrow";
import SetValidators from "./SetValidators";
import UpdateElectionRule from "./UpdateElectionRule";
import UpdateElectorate from "./UpdateElectorate";

interface Props {
  readonly action: ProposalAction;
}

const DisplayOptions = ({ action }: Props): JSX.Element => {
  switch (action.kind) {
    case ActionKind.CreateTextResolution:
      return <CreateTextResolution action={action} />;
    case ActionKind.ExecuteProposalBatch:
      return <ExecuteProposalBatch action={action} />;
    case ActionKind.ReleaseEscrow:
      return <ReleaseEscrow action={action} />;
    case ActionKind.SetValidators:
      return <SetValidators action={action} />;
    case ActionKind.UpdateElectionRule:
      return <UpdateElectionRule action={action} />;
    case ActionKind.UpdateElectorate:
      return <UpdateElectorate action={action} />;
    // the following cases use GenericProposal just so that we can upgrade the mainnet asap
    case ActionKind.ExecuteMigration:
    case ActionKind.SetAccountConfiguration:
    case ActionKind.SetCashConfiguration:
    case ActionKind.SetMsgFeeConfiguration:
    case ActionKind.SetPreRegistrationConfiguration:
    case ActionKind.SetQualityScoreConfiguration:
    case ActionKind.SetTermDepositConfiguration:
    case ActionKind.SetTxFeeConfiguration:
    case ActionKind.UpgradeSchema:
      return <GenericProposal action={action} />;
    default:
      throw new Error(`Action Kind "${action.kind}" not found. This is a bug.`);
  }
};

export default DisplayOptions;
