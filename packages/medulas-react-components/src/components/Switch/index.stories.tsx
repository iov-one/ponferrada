import { storiesOf } from '@storybook/react';
import React from 'react';
import Switch from './index';
import Block from '../Block';
import { Storybook } from '../../utils/storybook';

storiesOf('Components', module).add('Switch', () => (
  <Storybook>
    <Block>
      <Switch color="primary" label="With label" />
    </Block>
    <Block>
      <Switch color="primary" />
    </Block>
  </Storybook>
));
