import { TransferDomainTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_TRANSFER_DOMAIN = "req-transfer-domain-tx";

interface Props {
  readonly tx: TransferDomainTx;
}

const ReqTransferDomainTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_TRANSFER_DOMAIN}>
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        starname transfer request.
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        New owner:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.newAdmin}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqTransferDomainTx;
