import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import RecoveryPhrase from './index';

storiesOf('Routes/Recovery phrase', module).add(
  'Main',
  (): JSX.Element => (
    <Storybook>
      <RecoveryPhrase />
    </Storybook>
  )
);
