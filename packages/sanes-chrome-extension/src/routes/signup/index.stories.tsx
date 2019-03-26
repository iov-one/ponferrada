import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import NewAccount from './components/NewAccount';
import ShowPhrase from './components/ShowPhrase';

storiesOf('Routes/Signup', module)
  .add('New account page', () => (
    <Storybook>
      <NewAccount nextStep={action('next step')} />
    </Storybook>
  ))
  .add('Recovery Phrase page', () => (
    <Storybook>
      <ShowPhrase />
    </Storybook>
  ));
