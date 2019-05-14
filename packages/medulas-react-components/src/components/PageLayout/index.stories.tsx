import { storiesOf } from '@storybook/react';
import React from 'react';
import Typography from '../Typography';
import PageLayout from './index';
import { Storybook } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

storiesOf('Components', module).add(
  'Layout',
  (): JSX.Element => (
    <Storybook>
      <PageLayout primaryTitle="Title" title="storybook" onBack={action('clicking on back button')}>
        <Typography variant="h6">Layout content</Typography>
      </PageLayout>
    </Storybook>
  ),
);
