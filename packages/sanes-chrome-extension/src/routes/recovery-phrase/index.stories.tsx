import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import RecoveryPhrase from './index';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Recovery Phrase page',
  (): JSX.Element => (
    <Storybook>
      <RecoveryPhrase />
    </Storybook>
  ),
);
