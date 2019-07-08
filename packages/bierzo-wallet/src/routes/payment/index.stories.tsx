import { storiesOf } from '@storybook/react';
import React from 'react';

import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Payment from './index';

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Payment page',
    (): JSX.Element => (
      <DecoratedStorybook>
        <Payment />
      </DecoratedStorybook>
    ),
  );
