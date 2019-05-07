import { storiesOf } from '@storybook/react';
import React from 'react';
import DecoratedStorybook from '../../utils/storybook';
import Payment from './index';

storiesOf('Bierzo wallet', module).add(
  'Payment page',
  (): JSX.Element => (
    <DecoratedStorybook>
      <Payment />
    </DecoratedStorybook>
  )
);
