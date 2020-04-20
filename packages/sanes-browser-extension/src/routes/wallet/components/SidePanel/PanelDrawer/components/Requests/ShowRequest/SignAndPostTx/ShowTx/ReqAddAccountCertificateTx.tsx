import { AddAccountCertificateTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_ACCOUNT_ADD_CERT = "req-account-add-cert-tx";

interface Props {
  readonly tx: AddAccountCertificateTx;
}

const ReqAddAccountCertificateTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline id={REQ_ACCOUNT_ADD_CERT}>
        Add certificate to{" "}
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.name}*{tx.domain}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Certificate:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {Encoding.toBase64(tx.certificate)}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqAddAccountCertificateTx;
