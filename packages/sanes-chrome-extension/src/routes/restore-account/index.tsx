import * as React from 'react';
import RestoreAccountForm, { RECOVERY_PHRASE } from './components';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import { history } from '../../store/reducers';
import { PersonaManager } from '../../logic/persona';
import { PersonaContext } from '../../context/PersonaProvider';

const onBack = (): void => {
  history.goBack();
};

const RestoreAccount = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);

  const onRestore = async (formValues: FormValues): Promise<void> => {
    const mnemonic = formValues[RECOVERY_PHRASE];
    try {
      const persona = await PersonaManager.create(mnemonic);
      const accounts = await persona.getAccounts();

      personaProvider.update(accounts, persona.mnemonic);
    } catch (err) {
      console.log('Error raised when creating persona');
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <RestoreAccountForm onBack={onBack} onRestoreAccount={onRestore} />
    </React.Fragment>
  );
};

export default RestoreAccount;
