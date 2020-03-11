import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";

import RequireLogin from "../components/RequireLogin";
import { AccountManage, AccountRegister } from "./account";
import Addresses from "./addresses";
import Balance from "./balance";
import Login from "./login";
import {
  ADDRESSES_ROUTE,
  BALANCE_ROUTE,
  IOVNAME_MANAGE_ROUTE,
  LOGIN_ROUTE,
  NAME_MANAGE_ROUTE,
  PAYMENT_ROUTE,
  POLICY_ROUTE,
  REGISTER_IOVNAME_ROUTE,
  REGISTER_NAME_ROUTE,
  REGISTER_STARNAME_ROUTE,
  TERMS_ROUTE,
  TRANSACTIONS_ROUTE,
} from "./paths";
import Payment from "./payment";
import Policy from "./policy";
import Terms from "./terms";
import Transactions from "./transactions";

export const history = createBrowserHistory();

const Routes = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path={LOGIN_ROUTE} component={Login} />
      <RequireLogin>
        <Route exact path={PAYMENT_ROUTE} component={Payment} />
        <Route exact path={ADDRESSES_ROUTE} component={Addresses} />
        <Route exact path={IOVNAME_MANAGE_ROUTE} render={() => <AccountManage entity="iovname" />} />
        <Route exact path={NAME_MANAGE_ROUTE} render={() => <AccountManage entity="name" />} />
        <Route exact path={TRANSACTIONS_ROUTE} component={Transactions} />
        <Route exact path={BALANCE_ROUTE} component={Balance} />
        <Route exact path={REGISTER_IOVNAME_ROUTE} render={() => <AccountRegister entity="iovname" />} />
        <Route exact path={REGISTER_STARNAME_ROUTE} render={() => <AccountRegister entity="starname" />} />
        <Route exact path={REGISTER_NAME_ROUTE} render={() => <AccountRegister entity="name" />} />
        <Route exact path={TERMS_ROUTE} component={Terms} />
        <Route exact path={POLICY_ROUTE} component={Policy} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
