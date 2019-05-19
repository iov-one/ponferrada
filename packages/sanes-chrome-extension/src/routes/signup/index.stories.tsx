import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import NewAccountForm from './components/NewAccountForm';
import SecurityHintForm from './components/SecurityHintForm';
import ShowPhraseForm from './components/ShowPhraseForm';

storiesOf(`${CHROME_EXTENSION_ROOT}/Signup`, module)
  .add(
    'New Account page',
    (): JSX.Element => (
      <Storybook>
        <NewAccountForm onBack={action('back in history')} onSignup={action('next step')} />
      </Storybook>
    ),
  )
  .add(
    'Recovery Phrase page',
    (): JSX.Element => (
      <Storybook>
        <ShowPhraseForm onBack={action('back in history')} onHintPassword={action('hint step')} />
      </Storybook>
    ),
  )
  .add(
    'Security Hint page',
    (): JSX.Element => (
      <Storybook>
        <SecurityHintForm onBack={action('back in history')} onSaveHint={action('save hint')} />
      </Storybook>
    ),
  );
