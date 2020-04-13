import { FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";

import { PersonaContext, PersonaContextUpdateData } from "../../context/PersonaProvider";
import { PersonaData } from "../../extension/background/model/backgroundscript";
import { createPersona } from "../../utils/chrome";
import { history } from "../../utils/history";
import { storeHintPhrase } from "../../utils/localstorage/hint";
import { WALLET_STATUS_ROUTE } from "../paths";
import NewWalletForm, { PASSWORD_FIELD } from "./components/NewWalletForm";
import SecurityHintForm, { SECURITY_HINT } from "./components/SecurityHintForm";
import ShowWordsForm from "./components/ShowWordsForm";

const onBack = (): void => {
  history.goBack();
};

const CreateWallet = (): JSX.Element => {
  const [step, setStep] = React.useState<"first" | "second" | "third">("first");
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);

  const onNewWallet = (): void => setStep("first");
  const onShowWords = (): void => setStep("second");
  const onHintPassword = (): void => setStep("third");

  const onSaveHint = (formValues: FormValues): void => {
    const hintPhrase = formValues[SECURITY_HINT];

    storeHintPhrase(hintPhrase);

    history.push(WALLET_STATUS_ROUTE);
  };

  const onCreateWallet = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];

    let response: PersonaData;
    try {
      response = await createPersona(password, undefined);
    } catch (error) {
      toast.show("An error occurred while signing up.", ToastVariant.ERROR);
      console.error(error);
      return;
    }

    const personaData: PersonaContextUpdateData = {
      ...response,
      accounts: await response?.getAccounts(),
      balances: await response?.getBalances(),
      names: await response?.getNames(),
    };

    personaProvider.update({
      ...personaData,
      hasStoredPersona: true,
    });
    onShowWords();
  };

  return (
    <React.Fragment>
      {step === "first" && <NewWalletForm onBack={onBack} onCreateWallet={onCreateWallet} />}
      {step === "second" && (
        <ShowWordsForm
          mnemonic={personaProvider.mnemonic}
          onBack={onNewWallet}
          onHintPassword={onHintPassword}
        />
      )}
      {step === "third" && <SecurityHintForm onBack={onShowWords} onSaveHint={onSaveHint} />}
    </React.Fragment>
  );
};

export default CreateWallet;
