import * as React from "react";
import { Route, Router, Switch } from "react-router";

import { history } from "../utils/history";
import {
  RECOVERY_PHRASE_ROUTE,
  REQUEST_ROUTE,
  RESTORE_WALLET,
  SHARE_IDENTITY,
  SIGNUP_ROUTE,
  TX_REQUEST,
  UNLOCK_ROUTE,
  WALLET_STATUS_ROUTE,
  WELCOME_ROUTE,
} from "./paths";
import RecoveryPhrase from "./recovery-phrase";
import Requests from "./requests";
import RestoreWallet from "./restore-wallet";
import ShareIdentity from "./share-identity";
import Signup from "./signup";
import TxRequest from "./tx-request";
import Unlock from "./unlock";
import WalletStatus from "./wallet";
import Welcome from "./welcome";

export const MainRouter = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path={WELCOME_ROUTE} component={Welcome} />
      <Route exact path={SIGNUP_ROUTE} component={Signup} />
      <Route exact path={UNLOCK_ROUTE} component={Unlock} />
      <Route exact path={RECOVERY_PHRASE_ROUTE} component={RecoveryPhrase} />
      <Route exact path={RESTORE_WALLET} component={RestoreWallet} />
      <Route exact path={WALLET_STATUS_ROUTE} component={WalletStatus} />
      <Route exact path={SHARE_IDENTITY} component={ShareIdentity} />
      <Route exact path={TX_REQUEST} component={TxRequest} />
      <Route exact path={REQUEST_ROUTE} component={Requests} />
    </Switch>
  </Router>
);

export default MainRouter;
