import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from './welcome';
import Signup from './signup';
import { WELCOME_ROUTE, SIGNUP_ROUTE } from './paths';

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={SIGNUP_ROUTE} component={Signup} />
  </Switch>
);

export default MainRouter;
