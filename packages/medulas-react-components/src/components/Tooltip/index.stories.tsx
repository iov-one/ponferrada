import { storiesOf } from '@storybook/react';
import React from 'react';
import Tooltip from './index';
import Block from '../Block';
import Typography from '../Typography';
import { Storybook } from '../../utils/storybook';

storiesOf('Components', module).add('Tooltip', () => {
  const tooltipStyle: React.CSSProperties = { marginRight: '4px' };

  return (
    <Storybook>
      <Block marginBottom={4}>
        <Tooltip>
          <Typography>Some tooltip text</Typography>
        </Tooltip>
      </Block>
      <Block>
        <Typography inline style={tooltipStyle}>
          Loooooooooooooooooooooooooooooooooong text
        </Typography>
        <Tooltip>
          <Typography>Tooltip for long text</Typography>
        </Tooltip>
      </Block>
    </Storybook>
  );
});
