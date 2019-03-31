import * as React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import {
  ACCOUNT_NAME_FIELD,
  PASSWORD_FIELD,
} from './components/NewAccountForm';
import Persona from '../../logic/persona';
import { getPersona } from '../../logic';
import { history } from '../../store/reducers';

export interface UserData {
  readonly accountName: string;
  readonly password: string;
}

const onBack = (): void => {
  history.goBack();
};

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second' | 'third'>('first');
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const onNewAccount = (): void => setStep('first');
  const onShowPhrase = (): void => setStep('second');
  const onHintPassword = (): void => setStep('third');

  const onSaveHint = (_: FormValues): void => {};

  const onSignup = async (formValues: FormValues): Promise<void> => {
    const accountName = formValues[ACCOUNT_NAME_FIELD];
    const password = formValues[PASSWORD_FIELD];
    setUserData({
      accountName,
      password,
    });

    try {
      const persona: Persona = await getPersona(password, accountName);
      const account = persona.accounts.get(accountName);
      if (!account) {
        throw new Error('Signup create persona failed');
      }

      console.log(
        `We successfuly have created a persona registered in ${
          account.blockchainAddresses.size
        } chains`
      );

      onShowPhrase();
    } catch (err) {
      console.log('Error raised when creating persona');
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {step === 'first' && (
        <NewAccountForm onBack={onBack} onSignup={onSignup} />
      )}
      {step === 'second' && (
        <ShowPhraseForm
          onBack={onNewAccount}
          onHintPassword={onHintPassword}
          userData={userData}
        />
      )}
    </React.Fragment>
  );
};

export default Signup;
