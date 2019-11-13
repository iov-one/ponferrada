import { CreateProposalTx } from "@iov/bns";
import { Block, List, ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import ProposalActionType from "./ProposalActionType";
import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from "./TransactionFee";

export const REQ_CREATE_PROPOSAL = "req-create-proposal-tx";

interface Props {
  readonly tx: CreateProposalTx;
}

const ReqCreateProposalTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <List id={REQ_CREATE_PROPOSAL}>
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Title"
            secondary={tx.title}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Description"
            secondary={tx.description}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Start date"
            secondary={new Date(tx.startTime * 1000).toLocaleString()}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Election Rule ID"
            secondary={tx.electionRuleId}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Author"
            secondary={tx.author}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
        <TransactionFee fee={tx.fee} />
      </List>
      <Block marginTop={1}>
        <ProposalActionType action={tx.action} />
      </Block>
    </React.Fragment>
  );
};

export default ReqCreateProposalTx;
