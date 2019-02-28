import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home/container/App";
import Welcome from "./welcome/container";

export const HOME_ROUTE = "/";
export const WELCOME_ROUTE = "/welcome";

export const MainRouter = (): JSX.Element => (
  <Switch>
    <Route exact path={HOME_ROUTE} component={Home} />
    <Route exact path={WELCOME_ROUTE} component={Welcome} />
  </Switch>
);
export default MainRouter;
