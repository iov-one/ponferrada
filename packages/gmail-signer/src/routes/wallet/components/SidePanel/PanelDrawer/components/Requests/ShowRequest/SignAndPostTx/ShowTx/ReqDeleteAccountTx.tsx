import { DeleteAccountTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_DELETE_ACCOUNT = "req-delete-account-tx";

interface Props {
  readonly tx: DeleteAccountTx;
}

const ReqDeleteAccountTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_DELETE_ACCOUNT}>
        {tx.name}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        name deletion for{" "}
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

export default ReqDeleteAccountTx;
