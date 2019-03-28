import * as React from 'react';
import Layout from './components';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import {
  ACCOUNT_NAME_FIELD,
  PASSWORD_FIELD,
} from './components/NewAccountForm';
import Persona from '../../logic/persona';
import { getPersona } from '../../logic';

const onSignup = async (formValues: FormValues): Promise<void> => {
  const accountName = formValues[ACCOUNT_NAME_FIELD];
  const password = formValues[PASSWORD_FIELD];

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
    // TODO move to mnemonic step
  } catch (err) {
    console.log('Error raised when creating persona');
    console.log(err);
  }
};

const Signup = (): JSX.Element => {
  return <Layout onSignup={onSignup} />;
};

export default Signup;
