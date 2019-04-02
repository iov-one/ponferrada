import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';
import SecurityHintForm from './components/SecurityHintForm';

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
        onHintPassword={action('hint step')}
      />
    </Storybook>
  ))
  .add('Security hint page', () => (
    <Storybook>
      <SecurityHintForm
        onBack={action('back in history')}
        onSaveHint={action('save hint')}
      />
    </Storybook>
  ));
