import { ActionKind, ProposalAction } from "@iov/bns";
import { List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";
import CreateTextResolution from "./CreateTextResolution";
import ReleaseEscrow from "./ReleaseEscrow";
import Send from "./Send";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
});

interface Props {
  readonly action: ProposalAction;
}

function ProposalActionOptions({ action }: Props): JSX.Element {
  switch (action.kind) {
    case ActionKind.CreateTextResolution:
      return <CreateTextResolution action={action} />;
    case ActionKind.ReleaseEscrow:
      return <ReleaseEscrow action={action} />;
    case ActionKind.Send:
      return <Send action={action} />;
    default:
      throw new Error("Action Kind not found. This is a bug.");
  }
}

function ProposalActionType({ action }: Props): JSX.Element {
  const classes = useStyles();
  const listItemClasses = useTxListItemStyles();

  return (
    <List>
      <ListItem>
        <ListItemText classes={classes} primary="Action" />
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
