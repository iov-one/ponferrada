import { SendTransaction } from "@iov/bcp";
import { List, ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_SEND_TX = "req-send-tx";

interface Props {
  readonly tx: SendTransaction;
}

const ReqSendTransaction = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <List id={REQ_SEND_TX}>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Sender"
          secondary={tx.sender}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Beneficiary"
          secondary={tx.recipient}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Amount"
          secondary={amountToString(tx.amount)}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Notes"
          secondary={tx.memo || "--"}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <TransactionFee fee={tx.fee} />
    </List>
  );
};

export default ReqSendTransaction;
