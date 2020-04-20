import { DeleteAccountCertificateTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_ACCOUNT_DELETE_CERT = "req-account-delete-cert-tx";

interface Props {
  readonly tx: DeleteAccountCertificateTx;
}

const ReqDeleteAccountCertificateTx = ({ tx }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body1" inline id={REQ_ACCOUNT_DELETE_CERT}>
        Delete certificate to{" "}
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.name}*{tx.domain}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Certificate:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {Encoding.toBase64(tx.certificateHash)}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqDeleteAccountCertificateTx;
