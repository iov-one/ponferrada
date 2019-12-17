import { UpdateTargetsOfUsernameTx } from "@iov/bns";
import { Block, List, ListItem, ListItemText, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_UPDATE_TARGETS_USERNAME = "req-update-targets-username-tx";

interface Props {
  readonly tx: UpdateTargetsOfUsernameTx;
}

const ReqUpdateTargetsOfUsernameTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_UPDATE_TARGETS_USERNAME}>
        {tx.username}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        personalized address targets update request.
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">Addresses:</Typography>
      <List>
        {tx.targets.map(target => (
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

export default ReqUpdateTargetsOfUsernameTx;
