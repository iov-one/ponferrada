import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PAYMENT_ROUTE, WELCOME_ROUTE } from './paths';
import Payment from './payment';
import Welcome from './welcome';

const Router = (): JSX.Element => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={PAYMENT_ROUTE} component={Payment} />
  </Switch>
);

export default Router;
