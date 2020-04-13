import { FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";

import { PersonaContext, PersonaContextUpdateData } from "../../context/PersonaProvider";
import { PersonaData } from "../../extension/background/model/backgroundscript";
import { createPersona } from "../../utils/chrome";
import { history } from "../../utils/history";
import { WALLET_STATUS_ROUTE } from "../paths";
import SetMnemonicForm, { MNEMONIC_FIELD } from "./components/SetMnemonicForm";
import SetPasswordForm, { PASSWORD_FIELD } from "./components/SetPasswordForm";

const onBack = (): void => {
  history.goBack();
};

let mnemonic: string;

const RestoreWallet = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);
  const [step, setStep] = React.useState<"first" | "second">("first");

  const setStepMnemonic = (): void => setStep("first");
  const setStepPassword = (): void => setStep("second");

  const saveMnemonic = async (formValues: FormValues): Promise<void> => {
    mnemonic = formValues[MNEMONIC_FIELD];
    setStepPassword();
  };

  const restoreWallet = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];

    let response: PersonaData;
    try {
      response = await createPersona(password, mnemonic);
    } catch (error) {
      toast.show("An error occurred while restoring the wallet.", ToastVariant.ERROR);
      console.error(error);
      return;
    }

    const personaData: PersonaContextUpdateData = {
      ...response,
      accounts: await response?.getAccounts(),
      balances: await response?.getBalances(),
      names: await response?.getNames(),
    };

    personaProvider.update(personaData);

    history.push(WALLET_STATUS_ROUTE);
  };

  return (
    <React.Fragment>
      {step === "first" && <SetMnemonicForm onBack={onBack} onSetMnemonic={saveMnemonic} />}
      {step === "second" && <SetPasswordForm onBack={setStepMnemonic} onSetPassword={restoreWallet} />}
    </React.Fragment>
  );
};

export default RestoreWallet;
