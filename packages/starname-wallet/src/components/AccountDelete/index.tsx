import { Fee } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Typography } from "medulas-react-components";
import React from "react";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../AccountManage";
import AccountOperation from "../AccountOperation";

export const ACCOUNT_DELETE_LABEL = "account-delete-label";

interface HeaderProps {
  readonly account: BwAccountWithChainName;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): React.ReactElement => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are deleting{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline data-test={ACCOUNT_DELETE_LABEL}>
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

const AccountDelete = ({
  account,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
}: Props): React.ReactElement => {
  const getDeleteRequest = async (): Promise<JsonRpcRequest> => {
    return await getRequest();
  };

  const getDeleteFee = async (): Promise<Fee | undefined> => {
    return await getFee();
  };

  return (
    <AccountOperation
      submitCaption="Delete"
      onCancel={onCancel}
      getFee={getDeleteFee}
      getRequest={getDeleteRequest}
      bnsChainId={bnsChainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      header={<Header account={account} />}
    >
      {children}
    </AccountOperation>
  );
};

export default AccountDelete;
