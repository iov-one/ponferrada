import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getFirstUsername } from "../../store/usernames/selectors";
import { ADDRESSES_ROUTE, PAYMENT_ROUTE, REGISTER_USERNAME_ROUTE } from "../paths";
import Layout from "./components";

function onSendPayment(): void {
  history.push(PAYMENT_ROUTE);
}

function onReceivePayment(): void {
  history.push(ADDRESSES_ROUTE);
}

function onRegisterUsername(): void {
  history.push(REGISTER_USERNAME_ROUTE);
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;

  return (
    <PageMenu>
      <Layout
        onSendPayment={onSendPayment}
        onRegisterUsername={onRegisterUsername}
        onReceivePayment={onReceivePayment}
        iovAddress={iovAddress}
        balances={tokens}
      />
    </PageMenu>
  );
};

export default Balance;
