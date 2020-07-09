import { Address, Fee, Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import {
  generateTransferUsernameTxRequest,
  generateTransferUsernameTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwUsernameWithChainName } from "../../../../components/AccountManage";
import AccountTransfer from "../../../../components/AccountTransfer";
import { IOVNAME_MANAGE_ROUTE } from "../../../paths";

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
    New owner blockchain address, iovname or starname
  </Typography>
);

interface Props {
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const IovnameAccountTransfer = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwUsernameWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(IOVNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (newOwner: Address): Promise<Fee | undefined> => {
    return (await generateTransferUsernameTxWithFee(bnsIdentity, account.username, newOwner)).fee;
  };

  const getRequest = async (newOwner: Address): Promise<JsonRpcRequest> => {
    return await generateTransferUsernameTxRequest(bnsIdentity, account.username, newOwner);
  };

  return (
    <AccountTransfer
      onCancel={onReturnToManage}
      account={account}
      getFee={getFee}
      getRequest={getRequest}
      bnsChainId={bnsIdentity.chainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      transferPrompt={<TransferPrompt />}
    >
      <List disablePadding classes={listClasses}>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            The iovname and all associated names will be transfered to a new owner.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            No one will be able to send you assets on this iovname or any names associated to this iovname.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            You will not be able to recover this iovname after you transfer it, only if the new owner
            transfers it back to you.
          </Typography>
        </ListItem>
      </List>
    </AccountTransfer>
  );
};

export default IovnameAccountTransfer;
