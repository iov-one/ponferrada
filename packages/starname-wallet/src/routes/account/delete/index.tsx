import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { AccountProps } from "..";
import { history } from "../..";
import PageMenu from "../../../components/PageMenu";
import { RootState } from "../../../store/reducers";
import { TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmDelete from "./components/ConfirmDelete";
import NameAccountDelete from "./components/NameDelete";
import StarnameAccountDelete from "./components/StarnameDelete";

function onSeeTransactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}

const AccountDelete = ({ entity }: AccountProps): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);

  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmDelete transactionId={transactionId} onSeeTransactions={onSeeTransactions} />
      ) : (
        <Block
          marginTop={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {entity === "starname" && (
            <StarnameAccountDelete rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
          {entity === "name" && (
            <NameAccountDelete rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
        </Block>
      )}
    </PageMenu>
  );
};

export default AccountDelete;
