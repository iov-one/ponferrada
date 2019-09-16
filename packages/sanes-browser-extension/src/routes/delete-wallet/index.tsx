import { FormValues, ToastContext, ToastVariant, ValidationError } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { clearDatabase, clearPersona } from "../../utils/chrome";
import { history } from "../../utils/history";
import { DELETE_WALLET_ROUTE, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import DeleteForm, { MNEMONIC_FIELD } from "./components/DeleteForm";

const onBack = (): void => {
  history.push(WALLET_STATUS_ROUTE);
};

const DeleteWallet = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);
  const toast = React.useContext(ToastContext);

  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    if (!formValues[MNEMONIC_FIELD]) {
      errors[MNEMONIC_FIELD] = "Required";
    } else if (personaProvider.mnemonic !== formValues[MNEMONIC_FIELD]) {
      errors[MNEMONIC_FIELD] = "Wrong mnemonic entered, please try again.";
    }

    return errors;
  };

  const onDelete = async (): Promise<void> => {
    try {
      await clearPersona();
      await clearDatabase();
      personaProvider.update({
        hasStoredPersona: false,
      });
    } catch (error) {
      toast.show("An error has occurred during deleting wallet", ToastVariant.ERROR);
      console.error(error);
      return;
    }
    history.replace(WELCOME_ROUTE);
  };

  return (
    <NeumaPageLayout id={DELETE_WALLET_ROUTE} primaryTitle="Delete" title="Wallet" onBack={onBack}>
      <DeleteForm onDelete={onDelete} validate={validate} />
    </NeumaPageLayout>
  );
};

export default DeleteWallet;
