import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import { ElectionFilter } from "../components/AsideFilter";
import RequireLogin from "../components/RequireLogin";
import CreateProposal from "./create-proposal";
import Dashboard from "./dashboard";
import Login from "./login";
import {
  CREATE_PROPOSAL_ROUTE,
  DASHBOARD_ACTIVE_ROUTE,
  DASHBOARD_ENDED_ROUTE,
  DASHBOARD_ROUTE,
  DASHBOARD_SUBMITTED_ROUTE,
  LOGIN_ROUTE,
} from "./paths";

export const history = createBrowserHistory();

const Routes = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path={LOGIN_ROUTE} component={Login} />
      <RequireLogin>
        <Route exact path={DASHBOARD_ROUTE} component={() => <Dashboard filter={ElectionFilter.All} />} />
        <Route
          exact
          path={DASHBOARD_ACTIVE_ROUTE}
          component={() => <Dashboard filter={ElectionFilter.Active} />}
        />
        <Route
          exact
          path={DASHBOARD_SUBMITTED_ROUTE}
          component={() => <Dashboard filter={ElectionFilter.Submitted} />}
        />
        <Route
          exact
          path={DASHBOARD_ENDED_ROUTE}
          component={() => <Dashboard filter={ElectionFilter.Ended} />}
        />
        <Route exact path={CREATE_PROPOSAL_ROUTE} component={CreateProposal} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
