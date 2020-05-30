import * as React from "react";
import { Route, Router, Switch } from "react-router";

import { history } from "../utils/history";
import Collectibles from "./collectibles";
import CreateWallet from "./create-wallet";
import {
  COLLECTIBLES_ROUTE,
  CREATE_WALLET_ROUTE,
  RESTORE_WALLET,
  UNLOCK_ROUTE,
  WALLET_STATUS_ROUTE,
  WELCOME_ROUTE,
} from "./paths";
import RestoreWallet from "./restore-wallet";
import Unlock from "./unlock";
import WalletStatus from "./wallet";
import Welcome from "./welcome";

export const MainRouter = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route exact path={WELCOME_ROUTE} component={Welcome} />
      <Route exact path={CREATE_WALLET_ROUTE} component={CreateWallet} />
      <Route exact path={UNLOCK_ROUTE} component={Unlock} />
      <Route exact path={RESTORE_WALLET} component={RestoreWallet} />
      <Route exact path={WALLET_STATUS_ROUTE} component={WalletStatus} />
      <Route exact path={COLLECTIBLES_ROUTE} component={Collectibles} />
    </Switch>
  </Router>
);

export default MainRouter;
