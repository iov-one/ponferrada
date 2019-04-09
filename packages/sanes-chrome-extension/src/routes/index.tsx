import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from './welcome';
import Signup from './signup';
import Login from './login';
import { WELCOME_ROUTE, SIGNUP_ROUTE, LOGIN_ROUTE } from './paths';

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={SIGNUP_ROUTE} component={Signup} />
    <Route exact path={LOGIN_ROUTE} component={Login} />
  </Switch>
);

export default MainRouter;
