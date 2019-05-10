import { storiesOf } from '@storybook/react';
import React from 'react';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Welcome from './index';

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Welcome page',
    (): JSX.Element => (
      <DecoratedStorybook>
        <Welcome />
      </DecoratedStorybook>
    )
  );
