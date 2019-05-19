import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import RestoreAccountForm from './components';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Restore Account page',
  (): JSX.Element => (
    <Storybook>
      <RestoreAccountForm onBack={action('back in history')} onRestoreAccount={action('restore account')} />
    </Storybook>
  ),
);
