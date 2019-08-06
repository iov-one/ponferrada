import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";

import RequireLogin from "../components/RequireLogin";
import Balance from "./balance";
import Login from "./login";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, LOGIN_ROUTE, PAYMENT_ROUTE, TRANSACTIONS_ROUTE } from "./paths";
import Payment from "./payment";
import ReceivePayments from "./receivePayments";
import Transactions from "./transactions";

export const history = createBrowserHistory();

const Routes = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path={LOGIN_ROUTE} component={Login} />
      <RequireLogin>
        <Route exact path={PAYMENT_ROUTE} component={Payment} />
        <Route exact path={ADDRESSES_ROUTE} component={ReceivePayments} />
        <Route exact path={TRANSACTIONS_ROUTE} component={Transactions} />
        <Route exact path={BALANCE_ROUTE} component={Balance} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
