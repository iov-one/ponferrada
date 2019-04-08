import { storiesOf } from '@storybook/react';
import { SanesStorybook } from '../../utils/storybook';
import React from 'react';
import Layout from './index';

storiesOf('Routes/Login', module).add(
  'Login page',
  (): JSX.Element => (
    <SanesStorybook>
      <Layout />
    </SanesStorybook>
  )
);
