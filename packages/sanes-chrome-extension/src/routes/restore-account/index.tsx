import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import * as React from 'react';
import { PersonaContext } from '../../context/PersonaProvider';
import { history } from '../../store/reducers';
import { createPersona } from '../../utils/chrome';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import RestoreAccountForm, { RECOVERY_PHRASE } from './components';

const onBack = (): void => {
  history.goBack();
};

const RestoreAccount = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);

  const onRestore = async (formValues: FormValues): Promise<void> => {
    const mnemonic = formValues[RECOVERY_PHRASE];
    // TODO: use password from form (https://github.com/iov-one/ponferrada/issues/217)
    const response = await createPersona('default password', mnemonic);
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
