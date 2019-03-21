import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Button from './index';
import { Storybook } from '../../utils/storybook';
import Grid from '../Grid';
import GridItem from '../GridItem';

storiesOf('Components /Button', module)
  .add('Button in phone screen', () => (
    <div style={{ width: '425px' }}>
      <Storybook>
        <Grid flexWrap="wrap" flexDirection="column">
          <GridItem marginBottom={4}>
            <Button onClick={action('clicked')}>Hower</Button>
          </GridItem>
          <GridItem marginBottom={4}>
            <Button onClick={action('clicked')} disabled>
              Disabled
            </Button>
          </GridItem>
          <GridItem marginBottom={4}>
            <Button onClick={action('clicked')} color="secondary">
              Cancel
            </Button>
          </GridItem>
          <GridItem marginBottom={4}>
            <Button onClick={action('clicked')} fullWidth>
              Full Width
            </Button>
          </GridItem>
        </Grid>
      </Storybook>
    </div>
  ))
  .add('Button in desktop screen', () => (
    <Storybook>
      <Grid flexWrap="wrap" flexDirection="column">
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')}>Hower</Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} disabled>
            Disabled
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} color="secondary">
            Cancel
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} fullWidth>
            Full Width
          </Button>
        </GridItem>
      </Grid>
    </Storybook>
  ));
