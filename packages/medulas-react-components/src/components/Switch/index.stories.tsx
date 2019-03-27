import { storiesOf } from '@storybook/react';
import React from 'react';
import Switch from './index';
import { Storybook } from '../../utils/storybook';

storiesOf('Components', module).add('Switch', () => (
  <Storybook>
    <Switch color="primary" />
  </Storybook>
));
