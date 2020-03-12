import { TransferAccountTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_TRANSFER_ACCOUNT = "req-transfer-account-tx";

interface Props {
  readonly tx: TransferAccountTx;
}

const ReqTransferAccountTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_TRANSFER_ACCOUNT}>
        {tx.name}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        name transfer for{" "}
      </Typography>
      <Typography variant="body1" inline color="primary">
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        domain.
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        New owner:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.newOwner}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqTransferAccountTx;
