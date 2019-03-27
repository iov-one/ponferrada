import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import NewAccount from './components/NewAccount';

storiesOf('Routes/Signup', module).add('New account page', () => (
  <Storybook>
    <NewAccount nextStep={action('next step')} />
  </Storybook>
));
