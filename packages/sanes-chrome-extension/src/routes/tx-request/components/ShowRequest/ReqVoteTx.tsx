import { VoteTx } from "@iov/bns";
import { Typography } from "medulas-react-components";
import * as React from "react";

export const REQ_VOTE = "req-vote-tx";

interface Props {
  readonly tx: VoteTx;
}

const ReqVoteTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography id={REQ_VOTE}>{JSON.stringify(tx)}</Typography>
    </React.Fragment>
  );
};

export default ReqVoteTx;
