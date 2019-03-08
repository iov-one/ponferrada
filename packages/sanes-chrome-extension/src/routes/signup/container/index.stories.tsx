import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import Signup from './index';

storiesOf('/Routes Signup', module).add('Signup page', () => (
  <Storybook>
    <Signup />
  </Storybook>
));
