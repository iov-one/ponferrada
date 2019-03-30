import * as React from 'react';
import Layout from './components';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import {
  ACCOUNT_NAME_FIELD,
  PASSWORD_FIELD,
} from './components/NewAccountForm';
import Persona from '../../logic/persona';
import { getPersona } from '../../logic';

export interface UserData {
  readonly accountName: string;
  readonly password: string;
}

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second' | 'third'>('first');
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const onShowPhrase = (): void => setStep('second');
  const onHintPhrase = (): void => setStep('third');

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
      // TODO export to redux necessary info
      onShowPhrase();
    } catch (err) {
      console.log('Error raised when creating persona');
      console.log(err);
    }
  };

  return (
    <Layout
      userData={userData}
      onSignup={onSignup}
      onHintPhrase={onHintPhrase}
      step={step}
    />
  );
};

export default Signup;
