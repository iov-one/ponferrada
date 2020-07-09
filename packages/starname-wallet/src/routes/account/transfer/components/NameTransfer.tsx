import { Address } from "@iov/bcp";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { AccountLocationState } from "../..";
import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
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
    Person who will be using this name
  </Typography>
);

interface Props {
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const NameAccountTransfer = ({ setTransactionId, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const { account, domain }: AccountLocationState = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, domain);
  };

  const getFee = async (newOwner: Address): Promise<any | undefined> => {};

  const getRequest = async (newOwner: Address): Promise<any> => {};

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
