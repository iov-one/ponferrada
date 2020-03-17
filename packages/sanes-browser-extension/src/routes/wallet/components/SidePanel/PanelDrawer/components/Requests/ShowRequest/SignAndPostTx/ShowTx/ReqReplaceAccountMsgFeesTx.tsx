import { ReplaceAccountMsgFeesTx } from "@iov/bns";
import { Block, List, ListItem, ListItemText, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_REPLACE_ACCOUNT_MSGFEES = "req-replace-account-msgfees-tx";

interface Props {
  readonly tx: ReplaceAccountMsgFeesTx;
}

const ReqReplaceAccountMsgFeesTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_REPLACE_ACCOUNT_MSGFEES}>
        *{tx.domain}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">Updated fees:</Typography>
      <List>
        {tx.newMsgFees.map(msgfee => (
          <ListItem key={msgfee.msgPath}>
            <ListItemText
              classes={listItemClasses}
              primary={msgfee.msgPath}
              secondary={amountToString(msgfee.fee)}
              secondaryTypographyProps={txListItemSecondaryProps}
            />
          </ListItem>
        ))}
      </List>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqReplaceAccountMsgFeesTx;
