import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";

import RequireLogin from "../components/RequireLogin";
import Addresses from "./addresses";
import AddressManage from "./addressManage";
import Balance from "./balance";
import Login from "./login";
import {
  ADDRESS_MANAGE_ROUTE,
  ADDRESSES_ROUTE,
  BALANCE_ROUTE,
  LOGIN_ROUTE,
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
import Register, { ToRegister } from "./register";
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
        <Route exact path={ADDRESS_MANAGE_ROUTE} component={AddressManage} />
        <Route exact path={TRANSACTIONS_ROUTE} component={Transactions} />
        <Route exact path={BALANCE_ROUTE} component={Balance} />
        <Route exact path={REGISTER_IOVNAME_ROUTE} render={() => <Register entity={ToRegister.Iovname} />} />
        <Route
          exact
          path={REGISTER_STARNAME_ROUTE}
          render={() => <Register entity={ToRegister.Starname} />}
        />
        <Route exact path={REGISTER_NAME_ROUTE} render={() => <Register entity={ToRegister.Name} />} />
        <Route exact path={TERMS_ROUTE} component={Terms} />
        <Route exact path={POLICY_ROUTE} component={Policy} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
