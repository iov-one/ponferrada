import { VoteTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { List, ListItem } from "medulas-react-components";
import * as React from "react";

export const REQ_VOTE = "req-vote-tx";

const useStyles = makeStyles({
  txContent: {
    margin: "0",
    fontSize: "1.2rem",
    overflowX: "auto",
  },
});

interface Props {
  readonly tx: VoteTx;
}

const ReqVoteTx = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  const content = JSON.stringify(tx, null, 2);
  return (
    <List id={REQ_VOTE}>
      <ListItem>
        <pre className={classes.txContent}>{content}</pre>
      </ListItem>
    </List>
  );
};

export default ReqVoteTx;
