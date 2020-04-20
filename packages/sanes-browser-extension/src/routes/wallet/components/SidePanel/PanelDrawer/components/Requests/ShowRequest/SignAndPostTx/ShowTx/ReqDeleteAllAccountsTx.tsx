import { DeleteAllAccountsTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_DELETE_ALL_ACCOUNTS = "req-delete-all-accounts-tx";

interface Props {
  readonly tx: DeleteAllAccountsTx;
}

const ReqDeleteAllAccountsTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_DELETE_ALL_ACCOUNTS}>
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        starname all accounts deletion request.
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqDeleteAllAccountsTx;
