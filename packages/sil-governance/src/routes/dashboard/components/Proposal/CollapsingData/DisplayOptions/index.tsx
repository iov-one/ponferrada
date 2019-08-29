import {
  ActionKind,
  CreateTextResolutionAction,
  ExecuteProposalBatchAction,
  ProposalAction,
  ReleaseEscrowAction,
  SetValidatorsAction,
  UpdateElectionRuleAction,
  UpdateElectorateAction,
} from "@iov/bns";
import React from "react";

import CreateTextResolution from "./CreateTextResolution";
import ExecuteProposalBatch from "./ExecuteProposalBatch";
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
      return <CreateTextResolution action={action as CreateTextResolutionAction} />;
    case ActionKind.ExecuteProposalBatch:
      return <ExecuteProposalBatch action={action as ExecuteProposalBatchAction} />;
    case ActionKind.ReleaseEscrow:
      return <ReleaseEscrow action={action as ReleaseEscrowAction} />;
    case ActionKind.SetValidators:
      return <SetValidators action={action as SetValidatorsAction} />;
    case ActionKind.UpdateElectionRule:
      return <UpdateElectionRule action={action as UpdateElectionRuleAction} />;
    case ActionKind.UpdateElectorate:
      return <UpdateElectorate action={action as UpdateElectorateAction} />;
    default:
      throw new Error("Action Kind not found. This is a bug.");
  }
};

export default DisplayOptions;
