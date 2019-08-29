import { Block, Button, PageLayout, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../utils/history";
import { LOGIN_ROUTE, RESTORE_WALLET, SIGNUP_ROUTE, WELCOME_ROUTE } from "../paths";

const Welcome = (): JSX.Element => {
  const createNewWallet = (): void => {
    history.push(SIGNUP_ROUTE);
  };

  const login = (): void => {
    history.push(LOGIN_ROUTE);
  };

  const importWallet = (): void => {
    history.push(RESTORE_WALLET);
  };

  return (
    <PageLayout id={WELCOME_ROUTE} primaryTitle="Welcome" title="to your IOV manager">
      <Typography variant="body1" inline>
        This plugin lets you manage all your accounts in one place.
      </Typography>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={login}>
        Log in
      </Button>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={createNewWallet}>
        New Wallet
      </Button>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={importWallet}>
        Import Wallet
      </Button>
    </PageLayout>
  );
};

export default Welcome;
