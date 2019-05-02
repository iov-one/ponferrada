import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import React from 'react';
import Layout from './index';

storiesOf('Routes/Account', module).add('Show account status', () => (
  <Storybook>
    <ToastProvider>
      <Layout />
    </ToastProvider>
  </Storybook>
));
