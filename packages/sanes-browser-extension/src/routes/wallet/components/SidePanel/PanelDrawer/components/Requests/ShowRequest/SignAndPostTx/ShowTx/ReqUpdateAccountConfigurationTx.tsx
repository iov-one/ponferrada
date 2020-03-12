import { UpdateAccountConfigurationTx } from "@iov/bns";
import { Block, List, Typography } from "medulas-react-components";
import * as React from "react";

import TransactionFee from "./TransactionFee";

export const REQ_UPDATE_ACCOUNT_CONFIG = "req-update-account-config-tx";

interface Props {
  readonly tx: UpdateAccountConfigurationTx;
}

const ReqUpdateAccountConfigurationTx = ({ tx }: Props): JSX.Element => {
  const renewDate = new Date(tx.configuration.domainRenew * 1000).toLocaleDateString();

  return (
    <React.Fragment>
      <Typography variant="body1" inline>
        Update account configuration for{" "}
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.configuration.validName}*{tx.configuration.validDomain}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Blockchain ID:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.configuration.validBlockchainId}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Blockchain Address:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.configuration.validBlockchainAddress}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Owner:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {tx.configuration.owner}
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1" inline>
        Renew:
      </Typography>
      <Typography variant="body1" inline color="primary">
        {renewDate}
      </Typography>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqUpdateAccountConfigurationTx;
