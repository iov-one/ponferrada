import { RenewAccountTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_RENEW_ACCOUNT = "req-renew-account-tx";

interface Props {
  readonly tx: RenewAccountTx;
}

const ReqRenewAccountTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_RENEW_ACCOUNT}>
        {tx.name}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        name renewal for{" "}
      </Typography>
      <Typography variant="body1" inline color="primary">
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        domain.
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqRenewAccountTx;
