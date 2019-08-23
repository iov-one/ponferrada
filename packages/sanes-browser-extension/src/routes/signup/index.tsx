import { FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";

import { PersonaContext } from "../../context/PersonaProvider";
import { PersonaData } from "../../extension/background/model/backgroundscript";
import { createPersona } from "../../utils/chrome";
import { history } from "../../utils/history";
import { storeHintPhrase } from "../../utils/localstorage/hint";
import { ACCOUNT_STATUS_ROUTE } from "../paths";
import NewAccountForm, { ACCOUNT_NAME_FIELD, PASSWORD_FIELD } from "./components/NewAccountForm";
import SecurityHintForm, { SECURITY_HINT } from "./components/SecurityHintForm";
import ShowPhraseForm from "./components/ShowPhraseForm";

const onBack = (): void => {
  history.goBack();
};

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<"first" | "second" | "third">("first");
  const accountName = React.useRef<string | null>(null);
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);

  const onNewAccount = (): void => setStep("first");
  const onShowPhrase = (): void => setStep("second");
  const onHintPassword = (): void => setStep("third");

  const onSaveHint = (formValues: FormValues): void => {
    const hintPhrase = formValues[SECURITY_HINT];
    if (!accountName.current) {
      throw new Error("For saving password hint a valid account name should be provided");
    }

    storeHintPhrase(accountName.current, hintPhrase);

    history.push(ACCOUNT_STATUS_ROUTE);
  };

  const onSignup = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];
    accountName.current = formValues[ACCOUNT_NAME_FIELD];

    let response: PersonaData;
    try {
      response = await createPersona(password, undefined);
    } catch (error) {
      toast.show("An error occurred while signing up.", ToastVariant.ERROR);
      console.error(error);
      return;
    }

    personaProvider.update({
      accounts: response.accounts,
      mnemonic: response.mnemonic,
      txs: response.txs,
    });
    onShowPhrase();
  };

  return (
    <React.Fragment>
      {step === "first" && <NewAccountForm onBack={onBack} onSignup={onSignup} />}
      {step === "second" && <ShowPhraseForm onBack={onNewAccount} onHintPassword={onHintPassword} />}
      {step === "third" && <SecurityHintForm onBack={onShowPhrase} onSaveHint={onSaveHint} />}
    </React.Fragment>
  );
};

export default Signup;
