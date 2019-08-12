import { Block, Button, PageLayout, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../store/reducers";
import { LOGIN_ROUTE, RESTORE_ACCOUNT, SIGNUP_ROUTE, WELCOME_ROUTE } from "../paths";

const createNewAccount = (): void => {
  history.push(SIGNUP_ROUTE);
};

const login = (): void => {
  history.push(LOGIN_ROUTE);
};

const importAccount = (): void => {
  history.push(RESTORE_ACCOUNT);
};

const Welcome = (): JSX.Element => (
  <PageLayout id={WELCOME_ROUTE} primaryTitle="Welcome" title="to your IOV manager">
    <Typography variant="body1" inline>
      This plugin lets you manage all your accounts in one place.
    </Typography>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth onClick={login}>
      Log in
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth onClick={createNewAccount}>
      New account
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth onClick={importAccount}>
      Import account
    </Button>
  </PageLayout>
);

export default Welcome;
