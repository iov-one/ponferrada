import * as React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';
import SecurityHintForm from './components/SecurityHintForm';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import { ACCOUNT_NAME_FIELD, PASSWORD_FIELD } from './components/NewAccountForm';
import { history } from '../../store/reducers';
import { storeHintPhrase } from '../../utils/localstorage/hint';
import { SECURITY_HINT } from './components/SecurityHintForm';
import { PersonaManager } from '../../logic/persona';
import { PersonaContext } from '../../context/PersonaProvider';
import { ACCOUNT_STATUS_ROUTE } from '../paths';

const onBack = (): void => {
  history.goBack();
};

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second' | 'third'>('first');
  const accountName = React.useRef<string | null>(null);
  const personaProvider = React.useContext(PersonaContext);

  const onNewAccount = (): void => setStep('first');
  const onShowPhrase = (): void => setStep('second');
  const onHintPassword = (): void => setStep('third');

  const onSaveHint = (formValues: FormValues): void => {
    const hintPhrase = formValues[SECURITY_HINT];
    if (!accountName.current) {
      throw new Error('For saving password hint a valid account name should be provided');
    }

    storeHintPhrase(accountName.current, hintPhrase);

    history.push(ACCOUNT_STATUS_ROUTE);
  };

  const onSignup = async (formValues: FormValues): Promise<void> => {
    // FIXME Use form values once db storage and multi account is supported on Persona
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const password = formValues[PASSWORD_FIELD];
    accountName.current = formValues[ACCOUNT_NAME_FIELD];

    try {
      const persona = await PersonaManager.create();
      const accounts = await persona.getAccounts();
      const txs = await persona.getTxs();
      personaProvider.update(accounts, persona.mnemonic, txs);
      onShowPhrase();
    } catch (err) {
      console.log('Error raised when creating persona:', err);
    }
  };

  return (
    <React.Fragment>
      {step === 'first' && <NewAccountForm onBack={onBack} onSignup={onSignup} />}
      {step === 'second' && <ShowPhraseForm onBack={onNewAccount} onHintPassword={onHintPassword} />}
      {step === 'third' && <SecurityHintForm onBack={onShowPhrase} onSaveHint={onSaveHint} />}
    </React.Fragment>
  );
};

export default Signup;
