import { Block, Button, ToastContext, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { getConfigurationFile } from "../../extension/background/model/persona/config";
import { history } from "../../utils/history";
import { CREATE_WALLET_ROUTE, RESTORE_WALLET, UNLOCK_ROUTE, WELCOME_ROUTE } from "../paths";

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
      {personaProvider.hasPersona && (
        <Button variant="contained" fullWidth onClick={unlock}>
          Unlock
        </Button>
      )}
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={createNewWallet}>
        Create Wallet
      </Button>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth onClick={importWallet}>
        Import Wallet
      </Button>
    </NeumaPageLayout>
  );
};

export default Welcome;
