import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { AccountLocationState } from "../..";
import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountDelete from "../../../../components/AccountDelete";
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

interface Props {
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const NameAccountDelete = ({ setTransactionId, rpcEndpoint }: Props): React.ReactElement => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const { account, domain }: AccountLocationState = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, domain);
  };

  const getFee = async (): Promise<any | undefined> => {
    // return (await generateDeleteAccountTxWithFee(bnsIdentity, account.name, account.domain)).fee;
    return undefined;
  };

  const getRequest = async (): Promise<any> => {
    // return await generateDeleteAccountTxRequest(bnsIdentity, account.name, account.domain);
  };

  return (
    <AccountDelete
      onCancel={onReturnToManage}
      account={account}
      getRequest={getRequest}
      getFee={getFee}
      bnsChainId={""}
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
