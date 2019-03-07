import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Button } from './index';
import { Storybook } from '~/utils/storybook';
import { Grid } from '@material-ui/core';

storiesOf('Button', module)
  .add('Button in phone screen', () => (
    <div style={{ width: '425px' }}>
      <Storybook>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Button onClick={action('clicked')}>Hower</Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={action('clicked')} disabled>
              Disabled
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={action('clicked')} color="secondary">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={action('clicked')} fullWidth>
              Full Width
            </Button>
          </Grid>
        </Grid>
      </Storybook>
    </div>
  ))
  .add('Button in desktop screen', () => (
    <Storybook>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Button onClick={action('clicked')}>Hower</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={action('clicked')} disabled>
            Disabled
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={action('clicked')} color="secondary">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={action('clicked')} fullWidth>
            Full Width
          </Button>
        </Grid>
      </Grid>
    </Storybook>
  ));
