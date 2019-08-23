import { CreateProposalTx } from "@iov/bns";
import { Typography } from "medulas-react-components";
import * as React from "react";

export const REQ_CREATE_PROPOSAL = "req-create-proposal-tx";

interface Props {
  readonly tx: CreateProposalTx;
}

const ReqCreateProposalTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography id={REQ_CREATE_PROPOSAL}>{JSON.stringify(tx)}</Typography>
    </React.Fragment>
  );
};

export default ReqCreateProposalTx;
