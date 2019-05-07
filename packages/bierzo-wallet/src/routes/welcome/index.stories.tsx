import { storiesOf } from '@storybook/react';
import React from 'react';
import DecoratedStorybook from '../../utils/storybook';
import Welcome from './index';

storiesOf('Routes/Bierzo wallet', module).add(
  'Welcome page',
  (): JSX.Element => (
    <DecoratedStorybook>
      <Welcome />
    </DecoratedStorybook>
  )
);
