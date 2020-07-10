import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountRenew from "../../../../components/AccountRenew";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

export const STARNAME_RENEW_EXPIRATION = "starname-renew-expiration";

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

const StarnameAccountRenew = ({ setTransactionId, rpcEndpoint }: Props): React.ReactElement => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (): Promise<any | undefined> => {};

  const getRequest = async (): Promise<any> => {};

  return (
    <AccountRenew
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
            You are renewing *{account.domain}
          </Typography>
        </ListItem>
      </List>
    </AccountRenew>
  );
};

export default StarnameAccountRenew;
