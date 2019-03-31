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

type stepType = 'first' | 'second' | 'third';

interface State {
  readonly step: stepType;
  readonly userData: UserData | null;
}

class Signup extends React.Component<{}, State> {
  public readonly state = {
    step: 'first' as stepType,
    userData: null,
  };

  public onShowPhrase = (): void =>
    this.setState({
      step: 'second',
    });
  public onHintPhrase = (): void =>
    this.setState({
      step: 'third',
    });
  public onNewAccount = (): void =>
    this.setState({
      step: 'first',
    });

  public onSignup = async (formValues: FormValues): Promise<void> => {
    const accountName = formValues[ACCOUNT_NAME_FIELD];
    const password = formValues[PASSWORD_FIELD];
    this.setState({
      userData: {
        accountName,
        password,
      },
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
      this.onShowPhrase();
    } catch (err) {
      console.log('Error raised when creating persona');
      console.log(err);
    }
  };

  public render(): JSX.Element {
    const { step, userData } = this.state;

    return (
      <Layout
        onNewAccount={this.onNewAccount}
        userData={userData}
        onSignup={this.onSignup}
        onHintPhrase={this.onHintPhrase}
        step={step}
      />
    );
  }
}

export default Signup;
