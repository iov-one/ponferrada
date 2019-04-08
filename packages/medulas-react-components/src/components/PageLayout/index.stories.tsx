import { storiesOf } from '@storybook/react';
import React from 'react';
import Typography from '../Typography';
import PageLayout from './index';
import { Storybook } from '../../utils/storybook';

storiesOf('Components', module).add(
  'Layout',
  (): JSX.Element => (
    <Storybook>
      <PageLayout primaryTitle="Title" title="storybook">
        <Typography variant="h6">Layout content</Typography>
      </PageLayout>
    </Storybook>
  )
);
