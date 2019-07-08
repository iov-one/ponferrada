import { storiesOf } from '@storybook/react';
import React from 'react';

import { Storybook } from '../../utils/storybook';
import Block from '../Block';
import Switch from './index';

storiesOf('Components', module).add(
  'Switch',
  (): JSX.Element => (
    <Storybook>
      <Block>
        <Switch color="primary" label="With label" />
      </Block>
      <Block>
        <Switch color="primary" />
      </Block>
    </Storybook>
  ),
);
