import { TransferUsernameTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_TRANSFER_ACCOUNT = "req-transfer-account-tx";

interface Props {
  readonly tx: TransferUsernameTx;
}

const ReqTransferUsernameTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_TRANSFER_ACCOUNT}>
        {tx.username}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        iovname transfer
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">New owner:</Typography>
      <Typography variant="body1" color="primary">
        {tx.newOwner}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqTransferUsernameTx;
