import * as React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';
import SecurityHintForm from './components/SecurityHintForm';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import {
  ACCOUNT_NAME_FIELD,
  PASSWORD_FIELD,
} from './components/NewAccountForm';
import Persona from '../../logic/persona';
import { createPersona } from '../../logic';
import { history } from '../../store/reducers';
import { storeHintPhrase } from '../../utils/localstorage/hint';
import { SECURITY_HINT } from './components/SecurityHintForm';

const onBack = (): void => {
  history.goBack();
};

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second' | 'third'>('first');
  const accountName = React.useRef<string | null>(null);

  const onNewAccount = (): void => setStep('first');
  const onShowPhrase = (): void => setStep('second');
  const onHintPassword = (): void => setStep('third');

  const onSaveHint = (formValues: FormValues): void => {
    const hintPhrase = formValues[SECURITY_HINT];
    if (!accountName.current) {
      throw new Error(
        'For saving password hint a valid account name should be provided'
      );
    }

    storeHintPhrase(accountName.current, hintPhrase);
  };

  const onSignup = async (formValues: FormValues): Promise<void> => {
    const password = formValues[PASSWORD_FIELD];
    accountName.current = formValues[ACCOUNT_NAME_FIELD];

    try {
      const persona: Persona = await createPersona(
        password,
        accountName.current
      );
      const account = (await persona.accounts())[0];
      if (!account) {
        throw new Error('Signup create persona failed');
      }

      console.log(
        `We successfuly have created a persona registered in ${
          account.publicIdentities.size
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
        <ShowPhraseForm onBack={onNewAccount} onHintPassword={onHintPassword} />
      )}
      {step === 'third' && (
        <SecurityHintForm onBack={onShowPhrase} onSaveHint={onSaveHint} />
      )}
    </React.Fragment>
  );
};

export default Signup;
