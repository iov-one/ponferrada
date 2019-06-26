import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import RequireLogin from '../components/RequireLogin';
import Login from './login';
import { LOGIN_ROUTE, PAYMENT_ROUTE, WELCOME_ROUTE } from './paths';
import Payment from './payment';
import Welcome from './welcome';

export const history = createBrowserHistory();

const Routes = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path={LOGIN_ROUTE} component={Login} />
      <RequireLogin>
        <Route exact path={WELCOME_ROUTE} component={Welcome} />
        <Route exact path={PAYMENT_ROUTE} component={Payment} />
      </RequireLogin>
    </Switch>
  </Router>
);

export default Routes;
