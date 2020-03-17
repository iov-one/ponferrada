import { RenewDomainTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_RENEW_DOMAIN = "req-renew-domain-tx";

interface Props {
  readonly tx: RenewDomainTx;
}

const ReqRenewDomainTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_RENEW_DOMAIN}>
        *{tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        starname renewal request.
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqRenewDomainTx;
