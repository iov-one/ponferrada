import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import React from 'react';
import Layout from './index';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';

storiesOf(CHROME_EXTENSION_ROOT, module).add('Account Status page', () => (
  <Storybook>
    <ToastProvider>
      <Layout />
    </ToastProvider>
  </Storybook>
));
