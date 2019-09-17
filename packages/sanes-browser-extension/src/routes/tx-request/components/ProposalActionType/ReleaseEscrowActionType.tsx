import { ReleaseEscrowAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";

interface Props {
  readonly action: ReleaseEscrowAction;
}

function ReleaseEscrowActionType({ action }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <ListItemText
        classes={listItemClasses}
        primary="Escrow ID"
        secondary={action.escrowId}
        secondaryTypographyProps={txListItemSecondaryProps}
      />
      <ListItemText
        classes={listItemClasses}
        primary="Amount"
        secondary={amountToString(action.amount)}
        secondaryTypographyProps={txListItemSecondaryProps}
      />
    </React.Fragment>
  );
}

export default ReleaseEscrowActionType;
