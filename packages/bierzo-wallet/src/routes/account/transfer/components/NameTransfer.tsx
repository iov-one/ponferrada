import { Address, Fee, Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { AccountLocationState } from "../..";
import { history } from "../../..";
import {
  generateTransferAccountTxRequest,
  generateTransferAccountTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountTransfer from "../../../../components/AccountTransfer";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

const NAME_TRANSFER_ID = "name-transfer-id";

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

const TransferPrompt: React.FunctionComponent = (): JSX.Element => (
  <Typography color="default" variant="subtitle2">
    Person who will be using this name
  </Typography>
);

interface Props {
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const NameAccountTransfer = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const { account, domain }: AccountLocationState = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, domain);
  };

  const getFee = async (newOwner: Address): Promise<Fee | undefined> => {
    return (await generateTransferAccountTxWithFee(bnsIdentity, account.name, account.domain, newOwner)).fee;
  };

  const getRequest = async (newOwner: Address): Promise<JsonRpcRequest> => {
    return await generateTransferAccountTxRequest(bnsIdentity, account.name, account.domain, newOwner);
  };

  return (
    <AccountTransfer
      id={NAME_TRANSFER_ID}
      onCancel={onReturnToManage}
      account={account}
      getRequest={getRequest}
      getFee={getFee}
      bnsChainId={bnsIdentity.chainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      transferPrompt={<TransferPrompt />}
    >
      <List disablePadding classes={listClasses}>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            The person receiving this name will not have ownership over it, they can only use it to receive
            funds and link blockchain addresses to it.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            Any associated blockchain addresses will be unlinked before the name is transferred.
          </Typography>
        </ListItem>
      </List>
    </AccountTransfer>
  );
};

export default NameAccountTransfer;
