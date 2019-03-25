import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import Layout from '../components';

storiesOf('Routes/Signup', module)
  .add('New account page', () => (
    <Storybook>
      <Layout step="first" setStep={action('setStep')} />
    </Storybook>
  ))
  .add('Recovery Phrase page', () => (
    <Storybook>
      <Layout step="second" setStep={action('setStep')} />
    </Storybook>
  ));
