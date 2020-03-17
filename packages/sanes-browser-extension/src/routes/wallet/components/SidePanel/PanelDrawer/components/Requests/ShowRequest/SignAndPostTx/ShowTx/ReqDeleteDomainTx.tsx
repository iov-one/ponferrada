import { DeleteDomainTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_DELETE_DOMAIN = "req-delete-domain-tx";

interface Props {
  readonly tx: DeleteDomainTx;
}

const ReqDeleteDomainTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_DELETE_DOMAIN}>
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        starname deletion request.
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqDeleteDomainTx;
