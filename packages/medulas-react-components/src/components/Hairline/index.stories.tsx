import { storiesOf } from '@storybook/react';
import React from 'react';
import Typography from '../Typography';
import { Storybook } from '../../utils/storybook';
import Hairline from './index';
import Block from '../Block';

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
