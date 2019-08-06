import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getFirstUsername } from "../../store/usernames/selectors";
import { ADDRESSES_ROUTE, PAYMENT_ROUTE } from "../paths";
import Layout from "./components";

function onSendPayment(): void {
  history.push(PAYMENT_ROUTE);
}

function onReceivePayment(): void {
  history.push(ADDRESSES_ROUTE);
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;

  return (
    <PageMenu>
      <Layout
        onSendPayment={onSendPayment}
        onReceivePayment={onReceivePayment}
        iovAddress={iovAddress}
        balances={tokens}
      />
    </PageMenu>
  );
};

export default Balance;
