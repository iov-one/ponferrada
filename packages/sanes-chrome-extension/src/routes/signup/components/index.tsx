import * as React from 'react';
import NewAccountForm, { NewAccountProps } from './NewAccountForm';
import ShowPhraseForm from './ShowPhraseForm';
import { ShowPhraseProps } from './ShowPhraseForm';
import { history } from '../../../store/reducers/';

interface Props extends NewAccountProps, ShowPhraseProps {
  readonly step: string;
  readonly onHintPhrase: () => void;
  readonly onNewAccount: () => void;
}

const backToHistory = (): void => {
  history.goBack();
};

const Layout = ({
  onSignup,
  step,
  userData,
  onHintPhrase,
  onNewAccount,
}: Props): JSX.Element => {
  return (
    <React.Fragment>
      {step === 'first' && (
        <NewAccountForm onBackButton={backToHistory} onSignup={onSignup} />
      )}
      {step === 'second' && (
        <ShowPhraseForm
          onBackButton={onNewAccount}
          onHintPhrase={onHintPhrase}
          userData={userData}
        />
      )}
    </React.Fragment>
  );
};

export default Layout;
