import { RegisterDomainTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_REGISTER_DOMAIN = "req-register-domain-tx";

interface Props {
  readonly tx: RegisterDomainTx;
}

const ReqRegisterDomainTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_REGISTER_DOMAIN}>
        {tx.domain}
      </Typography>
      <Typography variant="body1" inline>
        {" "}
        starname registration request.
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqRegisterDomainTx;
