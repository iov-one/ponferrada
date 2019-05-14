import { storiesOf } from '@storybook/react';
import { SanesStorybook, CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import React from 'react';
import Layout from './index';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Login page',
  (): JSX.Element => (
    <SanesStorybook>
      <Layout />
    </SanesStorybook>
  ),
);
