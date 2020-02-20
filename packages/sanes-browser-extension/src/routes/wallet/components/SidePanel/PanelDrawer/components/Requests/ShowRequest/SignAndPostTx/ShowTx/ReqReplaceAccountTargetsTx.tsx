import { ReplaceAccountTargetsTx } from "@iov/bns";
import { Block, List, ListItem, ListItemText, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_REPLACE_ACCOUNT_TARGETS = "req-replace-account-targets-tx";

interface Props {
  readonly tx: ReplaceAccountTargetsTx;
}

const ReqReplaceAccountTargetsTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_REPLACE_ACCOUNT_TARGETS}>
        {tx.name}*{tx.domain}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">Addresses:</Typography>
      <List>
        {tx.newTargets.map(target => (
          <ListItem key={target.address}>
            <ListItemText
              classes={listItemClasses}
              primary={target.chainId}
              secondary={target.address}
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

export default ReqReplaceAccountTargetsTx;
