import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import RestoreAccountForm from './components';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Restore Account page',
  (): JSX.Element => (
    <Storybook>
      <RestoreAccountForm onBack={action('back in history')} onRestoreAccount={action('restore account')} />
    </Storybook>
  )
);
