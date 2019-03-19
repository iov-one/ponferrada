import { storiesOf } from '@storybook/react';
import React from 'react';
import TextField from './index';
import { Storybook } from '../../../utils/storybook';
import { Grid } from '@material-ui/core';

storiesOf('TextField', module).add('Examples', () => (
  <Storybook>
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <TextField
          error
          id="standard-error"
          label="Error"
          defaultValue="Standard Error"
          helperText="This is an error message"
          className={'test-standard-Placeholder'}
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="standard-with-placeholder"
          label="Filled"
          defaultValue="test*iov"
          className={'test-Placeholder'}
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          id="standard-disabled"
          label="Disabled"
          defaultValue="Disabled input"
          className={'test-disabled'}
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="standard-with-placeholder"
          label="Empty"
          placeholder="IOV or wallet address"
          className={'test-Placeholder'}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  </Storybook>
));
