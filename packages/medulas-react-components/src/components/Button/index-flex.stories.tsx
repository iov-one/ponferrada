import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Button from './index';
import { Storybook } from '../../utils/storybook';
import Grid from '../Grid';
import Block from '../Block';

storiesOf('Button', module).add('Button with Box flex layout', () => (
  <Storybook>
    <Grid flexWrap="wrap" flexDirection="column">
      <Block marginBottom={4}>
        <Button onClick={action('clicked')}>Hower</Button>
      </Block>
      <Block marginBottom={4}>
        <Button onClick={action('clicked')} disabled>
          Disabled
        </Button>
      </Block>
      <Block marginBottom={4}>
        <Button onClick={action('clicked')} color="secondary">
          Cancel
        </Button>
      </Block>
      <Block marginBottom={4}>
        <Button onClick={action('clicked')} fullWidth>
          Full Width
        </Button>
      </Block>
    </Grid>
  </Storybook>
));
