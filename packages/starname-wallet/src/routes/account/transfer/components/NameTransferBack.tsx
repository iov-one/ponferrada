import { FormValues, List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { AccountLocationState } from "../..";
import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountOperation from "../../../../components/AccountOperation";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

export const ACCOUNT_TRANSFER_BACK_LABEL = "account-transfer-back-label";

interface HeaderProps {
  readonly account: BwAccountWithChainName;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): JSX.Element => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      Transfer{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline data-test={ACCOUNT_TRANSFER_BACK_LABEL}>
      {account.name}*{account.domain}
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
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const NameAccountTransferBack = ({ setTransactionId, rpcEndpoint }: Props): JSX.Element => {
  const listClasses = useList();
  const listItemClasses = useListItem();

  const { account, domain }: AccountLocationState = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, domain);
  };

  const getFee = async (_values: FormValues): Promise<any | undefined> => undefined;

  const getRequest = async (_values: FormValues): Promise<any> => undefined;

  return (
    <AccountOperation
      submitCaption="Transfer back to me"
      onCancel={onReturnToManage}
      getFee={getFee}
      getRequest={getRequest}
      bnsChainId={""}
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
