import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import RequireLogin from '../components/RequireLogin';
import CreateProposal from './create-proposal';
import Dashboard from './dashboard';
import Login from './login';
import { CREATE_PROPOSAL_ROUTE, DASHBOARD_ROUTE, LOGIN_ROUTE } from './paths';

export const history = createBrowserHistory();

const Routes = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path={LOGIN_ROUTE} component={Login} />
      <RequireLogin>
        <Route exact path={DASHBOARD_ROUTE} component={Dashboard} />
        <Route exact path={CREATE_PROPOSAL_ROUTE} component={CreateProposal} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
