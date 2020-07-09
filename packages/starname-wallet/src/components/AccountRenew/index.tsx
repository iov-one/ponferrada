import { Fee } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Typography } from "medulas-react-components";
import React from "react";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../AccountManage";
import AccountOperation from "../AccountOperation";

interface HeaderProps {
  readonly account: BwAccountWithChainName;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): React.ReactElement => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are about to renew{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline>
      {account.name}*{account.domain}
    </Typography>
  </React.Fragment>
);

interface Props {
  readonly account: BwAccountWithChainName;
  readonly children: React.ReactNode;
  readonly bnsChainId: string;
  readonly onCancel: () => void;
  readonly getFee: () => Promise<Fee | undefined>;
  readonly getRequest: () => Promise<JsonRpcRequest>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AccountRenew: React.FunctionComponent<Props> = ({
  account,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
}): React.ReactElement => {
  return (
    <AccountOperation
      submitCaption="Renew"
      onCancel={onCancel}
      getFee={getFee}
      getRequest={getRequest}
      bnsChainId={bnsChainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      header={<Header account={account} />}
    >
      {children}
    </AccountOperation>
  );
};

export default AccountRenew;
