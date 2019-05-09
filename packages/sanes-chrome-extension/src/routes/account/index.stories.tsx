import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import React from 'react';
import Layout from './index';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';

export const ACCOUNT_STATUS_PAGE = 'Account Status page';

storiesOf(CHROME_EXTENSION_ROOT, module).add(ACCOUNT_STATUS_PAGE, () => (
  <Storybook>
    <ToastProvider>
      <Layout />
    </ToastProvider>
  </Storybook>
));
