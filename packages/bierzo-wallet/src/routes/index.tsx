import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";

import RequireLogin from "../components/RequireLogin";
import { AccountDelete, AccountManage, AccountRegister, AccountRenew, AccountUpdate } from "./account";
import AccountTransfer from "./account/transfer";
import Addresses from "./addresses";
import Balance from "./balance";
import Login from "./login";
import {
  ADDRESSES_ROUTE,
  BALANCE_ROUTE,
  IOVNAME_EDIT_ROUTE,
  IOVNAME_MANAGE_ROUTE,
  IOVNAME_REGISTER_ROUTE,
  IOVNAME_TRANSFER_ROUTE,
  LOGIN_ROUTE,
  NAME_DELETE_ROUTE,
  NAME_EDIT_ROUTE,
  NAME_MANAGE_ROUTE,
  NAME_REGISTER_ROUTE,
  NAME_TRANSFER_ROUTE,
  PAYMENT_ROUTE,
  POLICY_ROUTE,
  STARNAME_DELETE_ROUTE,
  STARNAME_MANAGE_ROUTE,
  STARNAME_REGISTER_ROUTE,
  STARNAME_RENEW_ROUTE,
  STARNAME_TRANSFER_ROUTE,
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
        <Route exact path={STARNAME_MANAGE_ROUTE} render={() => <AccountManage entity="starname" />} />
        <Route exact path={NAME_MANAGE_ROUTE} render={() => <AccountManage entity="name" />} />

        <Route exact path={IOVNAME_REGISTER_ROUTE} render={() => <AccountRegister entity="iovname" />} />
        <Route exact path={STARNAME_REGISTER_ROUTE} render={() => <AccountRegister entity="starname" />} />
        <Route exact path={NAME_REGISTER_ROUTE} render={() => <AccountRegister entity="name" />} />

        <Route exact path={IOVNAME_EDIT_ROUTE} render={() => <AccountUpdate entity="iovname" />} />
        <Route exact path={NAME_EDIT_ROUTE} render={() => <AccountUpdate entity="name" />} />

        <Route exact path={IOVNAME_TRANSFER_ROUTE} render={() => <AccountTransfer entity="iovname" />} />
        <Route exact path={STARNAME_TRANSFER_ROUTE} render={() => <AccountTransfer entity="starname" />} />
        <Route exact path={NAME_TRANSFER_ROUTE} render={() => <AccountTransfer entity="name" />} />

        <Route exact path={STARNAME_DELETE_ROUTE} render={() => <AccountDelete entity="starname" />} />
        <Route exact path={NAME_DELETE_ROUTE} render={() => <AccountDelete entity="name" />} />

        <Route exact path={STARNAME_RENEW_ROUTE} render={() => <AccountRenew entity="starname" />} />

        <Route exact path={TRANSACTIONS_ROUTE} component={Transactions} />
        <Route exact path={BALANCE_ROUTE} component={Balance} />
        <Route exact path={TERMS_ROUTE} component={Terms} />
        <Route exact path={POLICY_ROUTE} component={Policy} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
