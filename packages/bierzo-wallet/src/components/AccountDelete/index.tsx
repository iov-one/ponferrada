import { ChainId, Fee, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Typography } from "medulas-react-components";
import React from "react";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { AccountModuleMixedType, isAccountData } from "../AccountManage";
import AccountOperation from "../AccountOperation";

interface HeaderProps {
  readonly account: AccountModuleMixedType;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): JSX.Element => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are deleting{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline>
      {isAccountData(account) ? `${account.name}*${account.domain}` : account.username}
    </Typography>
  </React.Fragment>
);

interface Props {
  readonly id: string;
  readonly account: AccountModuleMixedType;
  readonly children: React.ReactNode;
  readonly bnsChainId: ChainId;
  readonly onCancel: () => void;
  readonly getFee: () => Promise<Fee | undefined>;
  readonly getRequest: () => Promise<JsonRpcRequest>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const AccountDelete = ({
  account,
  id,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
}: Props): JSX.Element => {
  const getDeleteRequest = async (): Promise<JsonRpcRequest> => {
    return await getRequest();
  };

  const getDeleteFee = async (): Promise<Fee | undefined> => {
    return await getFee();
  };

  return (
    <AccountOperation
      id={id}
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
