import { SendAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { txListItemSecondaryProps, useTxListItemHeaderStyles, useTxListItemStyles } from "../TransactionFee";

interface Props {
  readonly header?: boolean;
  readonly action: SendAction;
}

function Send({ action, header }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <React.Fragment>
      {header && (
        <ListItem>
          <ListItemText classes={listItemHeaderClasses} primary="Set Validators" />
        </ListItem>
      )}
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
