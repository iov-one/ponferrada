import { ActionKind, ProposalAction } from "@iov/bns";
import { List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";
import CreateTextResolutionActionType from "./CreateTextResolutionActionType";
import ReleaseEscrowActionType from "./ReleaseEscrowActionType";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
});

interface Props {
  readonly action: ProposalAction;
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
      {action.kind === ActionKind.CreateTextResolution && <CreateTextResolutionActionType action={action} />}
      {action.kind === ActionKind.ReleaseEscrow && <ReleaseEscrowActionType action={action} />}
    </List>
  );
}

export default ProposalActionType;
