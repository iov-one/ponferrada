import { storiesOf } from '@storybook/react';
import React from 'react';
import DecoratedStorybook, { VOTER_ROOT } from '../../utils/storybook';
import Dashboard from './index';

storiesOf(VOTER_ROOT, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Dashboard page',
    (): JSX.Element => (
      <DecoratedStorybook>
        <Dashboard />
      </DecoratedStorybook>
    ),
  );
