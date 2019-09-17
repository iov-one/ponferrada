import { SendAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";

interface Props {
  readonly action: SendAction;
}

function Send({ action }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Sender"
          secondary={action.sender}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Beneficiary"
          secondary={action.recipient}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Amount"
          secondary={amountToString(action.amount)}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Notes"
          secondary={action.memo || "--"}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </React.Fragment>
  );
}

export default Send;
