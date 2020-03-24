import { Fee, Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import {
  generateDeleteDomainTxRequest,
  generateDeleteDomainTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountDelete from "../../../../components/AccountDelete";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

const STARNAME_DELETE_ID = "starname-delete-id";

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

const StarnameAccountDelete = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (): Promise<Fee | undefined> => {
    return (await generateDeleteDomainTxWithFee(bnsIdentity, account.domain)).fee;
  };

  const getRequest = async (): Promise<JsonRpcRequest> => {
    return await generateDeleteDomainTxRequest(bnsIdentity, account.domain);
  };

  return (
    <AccountDelete
      id={STARNAME_DELETE_ID}
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
            Deleting this starname removes it from your account.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            All it’s associated names will become inactive this meaning even the names you have trasfered to
            other people.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            You may not be able to register this starname after you have deleted it.
          </Typography>
        </ListItem>
      </List>
    </AccountDelete>
  );
};

export default StarnameAccountDelete;
