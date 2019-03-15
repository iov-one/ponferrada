import { storiesOf } from '@storybook/react';
import { Grid } from '@material-ui/core';
import React from 'react';
import { Image } from './index';
import { Storybook } from '../../utils/storybook';
import iovLogo from './assets/iov-logo.png';

storiesOf('Image', module).add('Images', () => (
  <Storybook>
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Image src={iovLogo} alt="Iov Logo" />
      </Grid>
    </Grid>
  </Storybook>
));
