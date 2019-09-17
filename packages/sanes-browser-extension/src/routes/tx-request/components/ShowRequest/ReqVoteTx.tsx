import { VoteTx } from "@iov/bns";
import { List, ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { voteToString } from "ui-logic";

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_VOTE = "req-vote-tx";

interface Props {
  readonly tx: VoteTx;
}

const ReqVoteTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <List id={REQ_VOTE}>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Proposal ID"
          secondary={tx.proposalId}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Vote"
          secondary={voteToString(tx.selection, true)}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <TransactionFee fee={tx.fee} />
    </List>
  );
};

export default ReqVoteTx;
