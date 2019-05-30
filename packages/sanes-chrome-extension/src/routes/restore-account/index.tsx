import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import * as React from 'react';
import { PersonaContext } from '../../context/PersonaProvider';
import { history } from '../../store/reducers';
import { createPersona } from '../../utils/chrome';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import SetMnemonicForm, { MNEMONIC_FIELD } from './components/SetMnemonicForm';
import SetPasswordForm, { PASSWORD_FIELD } from './components/SetPasswordForm';

const onBack = (): void => {
  history.goBack();
};

let mnemonic: string;

const RestoreAccount = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);
  const [step, setStep] = React.useState<'first' | 'second'>('first');

  const setStepMnemonic = (): void => setStep('first');
  const setStepPassword = (): void => setStep('second');

  const saveMnemonic = async (formValues: FormValues): Promise<void> => {
    mnemonic = formValues[MNEMONIC_FIELD];
    setStepPassword();
  };

  const restoreAccount = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];

    const response = await createPersona(password, mnemonic);
    personaProvider.update({
      accounts: response.accounts,
      mnemonic: response.mnemonic,
      txs: response.txs,
    });

    history.push(ACCOUNT_STATUS_ROUTE);
  };

  return (
    <React.Fragment>
      {step === 'first' && <SetMnemonicForm onBack={onBack} onSetMnemonic={saveMnemonic} />}
      {step === 'second' && <SetPasswordForm onBack={setStepMnemonic} onSetPassword={restoreAccount} />}
    </React.Fragment>
  );
};

export default RestoreAccount;
