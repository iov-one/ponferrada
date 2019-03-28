import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import NewAccountForm from './components/NewAccountForm';
import ShowPhraseForm from './components/ShowPhraseForm';

storiesOf('Routes/Signup', module)
  .add('New account page', () => (
    <Storybook>
      <NewAccountForm onSignup={action('next step')} />
    </Storybook>
  ))
  .add('Recovery Phrase page', () => (
    <Storybook>
      <ShowPhraseForm />
    </Storybook>
  ));
