import { storiesOf } from '@storybook/react';
import React from 'react';

import DecoratedStorybook, { VOTER_ROOT } from '../../utils/storybook';
import Login from './index';

storiesOf(VOTER_ROOT, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Login page',
    (): JSX.Element => (
      <DecoratedStorybook>
        <Login />
      </DecoratedStorybook>
    ),
  );
