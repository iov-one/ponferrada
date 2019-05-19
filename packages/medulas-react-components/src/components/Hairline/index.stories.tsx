import React from 'react';

import { storiesOf } from '@storybook/react';

import { Storybook } from '../../utils/storybook';
import Block from '../Block';
import Typography from '../Typography';
import Hairline from './index';

storiesOf('Components', module).add('Hairline', () => (
  <Storybook>
    <Block marginBottom={4}>
      <Typography>Regular hairline without margin</Typography>
      <Hairline space={0} />
    </Block>
    <Block marginBottom={4}>
      <Typography>Regular hairline with unit 1 margin</Typography>
      <Hairline space={1} />
    </Block>
    <Block marginBottom={4}>
      <Typography>Regular hairline with unit 4 margin</Typography>
      <Hairline space={4} />
    </Block>
    <Block marginBottom={4}>
      <Typography>Hairline with custom color</Typography>
      <Hairline color="red" />
    </Block>
  </Storybook>
));
