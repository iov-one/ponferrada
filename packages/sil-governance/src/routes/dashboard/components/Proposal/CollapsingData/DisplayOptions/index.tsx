import {
  ActionKind,
  CreateTextResolutionAction,
  ProposalAction,
  ReleaseEscrowAction,
  SendAction,
  SetValidatorsAction,
  UpdateElectionRuleAction,
  UpdateElectorateAction,
} from "@iov/bns";
import React from "react";

import CreateTextResolution from "./CreateTextResolution";
import ReleaseEscrow from "./ReleaseEscrow";
import Send from "./Send";
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
    case ActionKind.ReleaseEscrow:
      return <ReleaseEscrow action={action as ReleaseEscrowAction} />;
    case ActionKind.Send:
      return <Send action={action as SendAction} />;
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
