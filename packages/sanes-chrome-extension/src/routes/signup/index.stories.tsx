import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';
import { UserData } from './index';

const userData: UserData = {
  accountName: 'accountName',
  password: 'password',
};

storiesOf('Routes/Signup', module)
  .add('New account page', () => (
    <Storybook>
      <NewAccountForm
        onBack={action('back in history')}
        onSignup={action('next step')}
      />
    </Storybook>
  ))
  .add('Recovery Phrase page', () => (
    <Storybook>
      <ShowPhraseForm
        onBack={action('back in history')}
        userData={userData}
        onHintPassword={action('hint step')}
      />
    </Storybook>
  ));
