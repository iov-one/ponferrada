import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/container/App';
import Welcome from './welcome/container';
import Signup from './signup';
import { HOME_ROUTE, WELCOME_ROUTE, SIGNUP_ROUTE } from './paths';

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={HOME_ROUTE} component={Home} />
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={SIGNUP_ROUTE} component={Signup} />
  </Switch>
);

export default MainRouter;
