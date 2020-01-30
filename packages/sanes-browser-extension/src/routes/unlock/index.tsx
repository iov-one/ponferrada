import { FormValues, ToastContext, ToastVariant, ValidationError } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext, PersonaContextUpdateData } from "../../context/PersonaProvider";
import { loadPersona } from "../../utils/chrome";
import { history } from "../../utils/history";
import { PASSWORD_FIELD } from "../create-wallet/components/NewWalletForm";
import { UNLOCK_ROUTE, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import UnlockControls from "./components/UnlockControls";
import UnlockForm from "./components/UnlockForm";

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = "Required";
  }

  return errors;
};

const onBack = (): void => {
  history.push(WELCOME_ROUTE);
};

const Unlock = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);
  const toast = React.useContext(ToastContext);

  const onUnlock = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];
    try {
      const response = await loadPersona(password);
      const personaData: PersonaContextUpdateData = {
        ...response,
        accounts: await response.getAccounts(),
        balances: await response.getBalances(),
        starnames: await response.getStarnames(),
      };

      personaProvider.update(personaData);

      history.push(WALLET_STATUS_ROUTE);
    } catch (error) {
      toast.show("Error during unlock", ToastVariant.ERROR);
    }
  };

  return (
    <NeumaPageLayout id={UNLOCK_ROUTE} primaryTitle="Unlock" title="" onBack={onBack}>
      <UnlockForm onUnlock={onUnlock} validate={validate} />
      <UnlockControls />
    </NeumaPageLayout>
  );
};

export default Unlock;
