import { Fee, Identity, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { List, ListItem, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import {
  generateRenewDomainTxRequest,
  generateRenewDomainTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountRenew from "../../../../components/AccountRenew";
import { getConnectionForBns } from "../../../../logic/connection";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

const STARNAME_RENEW_ID = "starname-renew-id";

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

const StarnameAccountRenew = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const [renewUntil, setRenewUntil] = React.useState(new Date());
  const listClasses = useList();
  const listItemClasses = useListItem();

  const account: BwAccountWithChainName = history.location.state;

  React.useEffect(() => {
    let isSubscribed = true;
    async function getDomainAccounts(): Promise<void> {
      const connection = await getConnectionForBns();
      const domainsNft = await connection.getDomains({ name: account.domain });
      const now = Date.now() / 1000;
      if (isSubscribed) {
        setRenewUntil(new Date((now + domainsNft[0].accountRenew) * 1000));
      }
    }
    getDomainAccounts();

    return () => {
      isSubscribed = false;
    };
  }, [account.domain]);

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (): Promise<Fee | undefined> => {
    return (await generateRenewDomainTxWithFee(bnsIdentity, account.domain)).fee;
  };

  const getRequest = async (): Promise<JsonRpcRequest> => {
    return await generateRenewDomainTxRequest(bnsIdentity, account.domain);
  };

  return (
    <AccountRenew
      id={STARNAME_RENEW_ID}
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
            You are renewing *{account.domain} until {renewUntil.toLocaleDateString()}{" "}
            {renewUntil.toLocaleTimeString()}
          </Typography>
        </ListItem>
      </List>
    </AccountRenew>
  );
};

export default StarnameAccountRenew;
