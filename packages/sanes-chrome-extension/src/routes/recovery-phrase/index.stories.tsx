import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import RecoveryPhrase from './index';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Recovery Phrase page',
  (): JSX.Element => (
    <Storybook>
      <RecoveryPhrase />
    </Storybook>
  ),
);
