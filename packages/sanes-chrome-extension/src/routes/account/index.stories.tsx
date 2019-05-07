import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import React from 'react';
import Layout from './index';

storiesOf('Extension', module).add('Account Status page', () => (
  <Storybook>
    <ToastProvider>
      <Layout />
    </ToastProvider>
  </Storybook>
));
