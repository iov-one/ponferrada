import { storiesOf } from '@storybook/react';
import React from 'react';
import TextField from './index';
import { Storybook } from '../../utils/storybook';
import { Grid } from '@material-ui/core';

storiesOf('TextField', module).add('Examples', () => (
  <Storybook>
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <TextField
          id="outlined-with-placeholder"
          label="Outlined Placeholder"
          placeholder="Outlined Placeholder test"
          className={'test-Placeholder'}
          margin="normal"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="standard-with-placeholder"
          label="Standard placeholder"
          placeholder="Standard Placeholder test"
          className={'test-standard-Placeholder'}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="standard-password-input"
          label="Password"
          className={'test-Password'}
          type="password"
          autoComplete="current-standard-Password"
          margin="normal"
        />
      </Grid>
    </Grid>
  </Storybook>
));
