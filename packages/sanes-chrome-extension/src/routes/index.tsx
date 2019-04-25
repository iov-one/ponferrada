import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from './welcome';
import Signup from './signup';
import Login from './login';
import RecoveryPhrase from './recovery-phrase';
import RestoreAccount from './restore-account';
import { WELCOME_ROUTE, SIGNUP_ROUTE, LOGIN_ROUTE, RECOVERY_PHRASE_ROUTE, RESTORE_ACCOUNT } from './paths';

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={SIGNUP_ROUTE} component={Signup} />
    <Route exact path={LOGIN_ROUTE} component={Login} />
    <Route exact path={RECOVERY_PHRASE_ROUTE} component={RecoveryPhrase} />
    <Route exact path={RESTORE_ACCOUNT} component={RestoreAccount} />
  </Switch>
);

export default MainRouter;
