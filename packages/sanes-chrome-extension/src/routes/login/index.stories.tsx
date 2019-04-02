import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import Layout from './index';

storiesOf('Routes/Login', module).add('Login page', () => (
  <Storybook>
    <Layout />
  </Storybook>
));
