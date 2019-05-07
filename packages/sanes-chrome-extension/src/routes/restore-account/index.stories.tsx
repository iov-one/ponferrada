import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import RestoreAccountForm from './components';

storiesOf('Extension', module).add(
  'Restore Account page',
  (): JSX.Element => (
    <Storybook>
      <RestoreAccountForm onBack={action('back in history')} onRestoreAccount={action('restore account')} />
    </Storybook>
  )
);
