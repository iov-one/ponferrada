import { Block, Button, Link, ToastContext, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { getConfigurationFile } from "../../extension/background/model/persona/config";
import { history } from "../../utils/history";
import { CREATE_WALLET_ROUTE, POLICY_URL, RESTORE_WALLET, UNLOCK_ROUTE, WELCOME_ROUTE } from "../paths";

export const UNLOCK_WALLET_ID = "welcome-unlock-wallet";
export const CREATE_WALLET_ID = "welcome-create-wallet";
export const IMPORT_WALLET_ID = "welcome-import-wallet";

const Welcome = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);
  const toast = React.useContext(ToastContext);

  const createNewWallet = async (): Promise<void> => {
    if ((await getConfigurationFile()).walletCreationDisabled) {
      toast.show(
        "Please use an external address generator and import the Wallet using your mnemonic.",
        ToastVariant.INFO,
      );
      return;
    }

    history.push(CREATE_WALLET_ROUTE);
  };

  const unlock = (): void => {
    history.push(UNLOCK_ROUTE);
  };

  const importWallet = (): void => {
    history.push(RESTORE_WALLET);
  };

  return (
    <NeumaPageLayout id={WELCOME_ROUTE} primaryTitle="Welcome" title="to Neuma">
      <Typography variant="body1" inline>
        This extension lets you manage all your accounts in one place.
      </Typography>
      <Block marginTop={2} />
      {personaProvider.hasStoredPersona && (
        <Button variant="contained" fullWidth onClick={unlock} id={UNLOCK_WALLET_ID}>
          Unlock
        </Button>
      )}
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={createNewWallet} id={CREATE_WALLET_ID}>
        Create Wallet
      </Button>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={importWallet} id={IMPORT_WALLET_ID}>
        Import Wallet
      </Button>
      <Block marginTop={8} display="flex" justifyContent="center">
        <Link to={POLICY_URL}>
          <Typography variant="subtitle2" color="primary" link>
            Privacy policy
          </Typography>
        </Link>
      </Block>
    </NeumaPageLayout>
  );
};

export default Welcome;
