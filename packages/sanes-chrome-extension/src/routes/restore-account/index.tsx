import * as React from 'react';
import RestoreAccountForm, { RECOVERY_PHRASE } from './components';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import { history } from '../../store/reducers';
import { PersonaContext } from '../../context/PersonaProvider';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import { MessageToBackground } from '../../extension/utils/types';

const onBack = (): void => {
  history.goBack();
};

const RestoreAccount = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);
  const toast = React.useContext(ToastContext);

  const onRestore = async (formValues: FormValues): Promise<void> => {
    const mnemonic = formValues[RECOVERY_PHRASE];

    const message: MessageToBackground = {
      action: 'create_persona',
      data: mnemonic,
    };

    chrome.runtime.sendMessage(message, response => {
      console.log(response);
      personaProvider.update(response.accounts, response.mnemonic, response.txs);
      history.push(ACCOUNT_STATUS_ROUTE);
    });
  };

  return (
    <React.Fragment>
      <RestoreAccountForm onBack={onBack} onRestoreAccount={onRestore} />
    </React.Fragment>
  );
};

export default RestoreAccount;
