import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { storiesOf } from '@storybook/react';

import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import Layout from './index';

export const ACCOUNT_STATUS_PAGE = 'Account Status page';

storiesOf(CHROME_EXTENSION_ROOT, module).add(ACCOUNT_STATUS_PAGE, () => (
  <Storybook>
    <ToastProvider>
      <Layout />
    </ToastProvider>
  </Storybook>
));
