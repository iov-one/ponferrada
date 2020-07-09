import { Address } from "@iov/bcp";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountTransfer from "../../../../components/AccountTransfer";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

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
    New owner blockchain address or Starname
  </Typography>
);

interface Props {
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const StarnameAccountTransfer = ({ setTransactionId, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (newOwner: Address): Promise<any | undefined> => {
    return undefined;
  };

  const getRequest = async (newOwner: Address): Promise<any> => {
    return undefined;
  };

  return (
    <AccountTransfer
      onCancel={onReturnToManage}
      account={account}
      getRequest={getRequest}
      getFee={getFee}
      bnsChainId={""}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      transferPrompt={<TransferPrompt />}
    >
      <List disablePadding classes={listClasses}>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            The starname and all associated names will be transfered to a new owner.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            No one will be able to send you assets on this starname or any names associated to this starname.
          </Typography>
        </ListItem>
        <ListItem disableGutters classes={listItemClasses}>
          <Typography color="default" variant="subtitle1" inline>
            You will not be able to recover this starname after you transfer it, only if the new owner
            transfers it back to you.
          </Typography>
        </ListItem>
      </List>
    </AccountTransfer>
  );
};

export default StarnameAccountTransfer;
