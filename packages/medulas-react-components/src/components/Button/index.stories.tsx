import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Button from './index';
import Download from './Download';
import Back from './Back';
import { Storybook } from '../../utils/storybook';
import Grid from '../Grid';
import GridItem from '../GridItem';

storiesOf('Components', module).add(
  'Buttons',
  (): JSX.Element => (
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
          <Button onClick={action('clicked')} variant="continue">
            Continue
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} spinner>
            Loading
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} color="secondary">
            Cancel
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Back onClick={action('clicked')}>Back</Back>
        </GridItem>
        <GridItem marginBottom={4}>
          <Button onClick={action('clicked')} fullWidth>
            Full Width
          </Button>
        </GridItem>
        <GridItem marginBottom={4}>
          <Download onDownload={action('clicked')}>Download</Download>
        </GridItem>
      </Grid>
    </Storybook>
  ),
);
