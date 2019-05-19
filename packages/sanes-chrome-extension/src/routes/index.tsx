import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountStatus from './account';
import Login from './login';
import {
  ACCOUNT_STATUS_ROUTE,
  LOGIN_ROUTE,
  RECOVERY_PHRASE_ROUTE,
  RESTORE_ACCOUNT,
  SHARE_IDENTITY,
  SIGNUP_ROUTE,
  TX_REQUEST,
  WELCOME_ROUTE,
} from './paths';
import RecoveryPhrase from './recovery-phrase';
import RestoreAccount from './restore-account';
import ShareIdentity from './share-identity';
import Signup from './signup';
import TxRequest from './tx-request';
import Welcome from './welcome';

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
    <Route exact path={SIGNUP_ROUTE} component={Signup} />
    <Route exact path={LOGIN_ROUTE} component={Login} />
    <Route exact path={RECOVERY_PHRASE_ROUTE} component={RecoveryPhrase} />
    <Route exact path={RESTORE_ACCOUNT} component={RestoreAccount} />
    <Route exact path={ACCOUNT_STATUS_ROUTE} component={AccountStatus} />
    <Route exact path={SHARE_IDENTITY} component={ShareIdentity} />
    <Route exact path={TX_REQUEST} component={TxRequest} />
  </Switch>
);

export default MainRouter;
