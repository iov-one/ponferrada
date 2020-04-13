import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import Layout from "./components";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

const Balance = (): JSX.Element => {
  const balances = ReactRedux.useSelector((state: RootState) => state.balances);
  const accounts = ReactRedux.useSelector((state: RootState) => state.accounts);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);

  const firstIovAccount = accounts.find(account => account.domain === "iov");
  const iovAddress = firstIovAccount ? `${firstIovAccount.name}*${firstIovAccount.domain}` : undefined;

  return (
    <PageMenu>
      <Layout
        iovAddress={iovAddress}
        balances={balances}
        onRegisterIovname={onRegisterIovname}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Balance;
