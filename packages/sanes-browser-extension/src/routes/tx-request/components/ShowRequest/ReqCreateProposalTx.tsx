import { CreateProposalTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { List, ListItem } from "medulas-react-components";
import * as React from "react";

export const REQ_CREATE_PROPOSAL = "req-create-proposal-tx";

const useStyles = makeStyles({
  txContent: {
    margin: "0",
    fontSize: "1.2rem",
    overflowX: "scroll",
  },
});

interface Props {
  readonly tx: CreateProposalTx;
}

const ReqCreateProposalTx = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  const content = JSON.stringify(tx, null, 2);
  return (
    <List id={REQ_CREATE_PROPOSAL}>
      <ListItem>
        <pre className={classes.txContent}>{content}</pre>
      </ListItem>
    </List>
  );
};

export default ReqCreateProposalTx;
