import { Fee, Identity, TransactionId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { FormValues, List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import {
  generateTransferAccountTxRequest,
  generateTransferAccountTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountOperation from "../../../../components/AccountOperation";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

const NAME_TRANSFER_BACK_ID = "name-transfer-back-id";

interface HeaderProps {
  readonly account: BwAccountWithChainName;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): JSX.Element => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      Transfer{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline>
      {`${account.name}*${account.domain}`}
    </Typography>
    <Typography color="default" variant="h5" inline>
      {" "}
      back to me
    </Typography>
  </React.Fragment>
);

const useList = makeStyles({
  root: {
    backgroundColor: "inherit",
    border: "none",
    listStyle: "disc inside",
    fontSize: "1.6rem",
    color: "#1C1C1C",
  },
});

const useListItem = makeStyles({
  root: {
    display: "list-item",
  },
});

interface Props {
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const NameAccountTransferBack = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;
  const ownerAddress = bnsCodec.identityToAddress(bnsIdentity);

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (_values: FormValues): Promise<Fee | undefined> =>
    (await generateTransferAccountTxWithFee(bnsIdentity, account.name, account.domain, ownerAddress)).fee;

  const getRequest = async (_values: FormValues): Promise<JsonRpcRequest> =>
    await generateTransferAccountTxRequest(bnsIdentity, account.name, account.domain, ownerAddress);

  return (
    <AccountOperation
      id={NAME_TRANSFER_BACK_ID}
      submitCaption="Transfer back to me"
      onCancel={onReturnToManage}
      getFee={getFee}
      getRequest={getRequest}
      bnsChainId={bnsIdentity.chainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      header={<Header account={account} />}
    >
      <List disablePadding classes={listClasses}>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            The name is transferred back to you and you can link any addresses to it.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            Any associated blockchain addresses will be unlinked before the name is transferred.
          </Typography>
        </ListItem>
      </List>
    </AccountOperation>
  );
};

export default NameAccountTransferBack;
