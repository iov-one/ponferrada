import { Fee, Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import {
  generateDeleteAccountTxRequest,
  generateDeleteAccountTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountDelete from "../../../../components/AccountDelete";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import { NAME_MANAGE_ROUTE } from "../../../paths";

const NAME_DELETE_ID = "name-delete-id";

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

const NameAccountDelete = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(NAME_MANAGE_ROUTE, account);
  };

  const getFee = async (): Promise<Fee | undefined> => {
    return (await generateDeleteAccountTxWithFee(bnsIdentity, account.name, account.domain)).fee;
  };

  const getRequest = async (): Promise<JsonRpcRequest> => {
    return await generateDeleteAccountTxRequest(bnsIdentity, account.name, account.domain);
  };

  return (
    <AccountDelete
      id={NAME_DELETE_ID}
      onCancel={onReturnToManage}
      account={account}
      getRequest={getRequest}
      getFee={getFee}
      bnsChainId={bnsIdentity.chainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
    >
      <List disablePadding classes={listClasses}>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            Deleting this name removes it from your account.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            You can create it again but all the associated addresses will be unlinked.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            No one will be able to send you funds to this name.
          </Typography>
        </ListItem>
      </List>
    </AccountDelete>
  );
};

export default NameAccountDelete;
