import { ActionKind, ProposalAction } from "@iov/bns";
import { List, ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemHeaderStyles, useTxListItemStyles } from "../TransactionFee";
import CreateTextResolution from "./CreateTextResolution";
import ExecuteProposalBatch from "./ExecuteProposalBatch";
import ReleaseEscrow from "./ReleaseEscrow";
import Send from "./Send";
import SetValidators from "./SetValidators";
import UpdateElectionRule from "./UpdateElectionRule";
import UpdateElectorate from "./UpdateElectorate";

interface Props {
  readonly header?: boolean;
  readonly action: ProposalAction;
}

export function ProposalActionOptions({ action, header }: Props): JSX.Element {
  switch (action.kind) {
    case ActionKind.CreateTextResolution:
      return <CreateTextResolution action={action} header={header} />;
    case ActionKind.ReleaseEscrow:
      return <ReleaseEscrow action={action} header={header} />;
    case ActionKind.Send:
      return <Send action={action} header={header} />;
    case ActionKind.SetValidators:
      return <SetValidators action={action} header={header} />;
    case ActionKind.UpdateElectionRule:
      return <UpdateElectionRule action={action} header={header} />;
    case ActionKind.UpdateElectorate:
      return <UpdateElectorate action={action} header={header} />;
    case ActionKind.ExecuteProposalBatch:
      return <ExecuteProposalBatch action={action} />;
    default:
      throw new Error("Action Kind not found. This is a bug.");
  }
}

function ProposalActionType({ action }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <List>
      <ListItem>
        <ListItemText classes={listItemHeaderClasses} primary="Action" />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Kind"
          secondary={action.kind}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ProposalActionOptions action={action} />
    </List>
  );
}

export default ProposalActionType;
