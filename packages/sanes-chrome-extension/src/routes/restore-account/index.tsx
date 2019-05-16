import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import * as React from 'react';
import { PersonaContext } from '../../context/PersonaProvider';
import { sendCreatePersonaMessage } from '../../extension/background/messages';
import { history } from '../../store/reducers';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import RestoreAccountForm, { RECOVERY_PHRASE } from './components';

const onBack = (): void => {
  history.goBack();
};

const RestoreAccount = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);

  const onRestore = async (formValues: FormValues): Promise<void> => {
    const mnemonic = formValues[RECOVERY_PHRASE];
    const response = await sendCreatePersonaMessage(mnemonic);
    personaProvider.update({
      accounts: response.accounts,
      mnemonic: response.mnemonic,
      txs: response.txs,
    });
    history.push(ACCOUNT_STATUS_ROUTE);
  };

  return (
    <React.Fragment>
      <RestoreAccountForm onBack={onBack} onRestoreAccount={onRestore} />
    </React.Fragment>
  );
};

export default RestoreAccount;
