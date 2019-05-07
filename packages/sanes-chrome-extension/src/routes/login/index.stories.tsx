import { storiesOf } from '@storybook/react';
import { SanesStorybook } from '../../utils/storybook';
import React from 'react';
import Layout from './index';

storiesOf('Extension', module).add(
  'Login page',
  (): JSX.Element => (
    <SanesStorybook>
      <Layout />
    </SanesStorybook>
  )
);
