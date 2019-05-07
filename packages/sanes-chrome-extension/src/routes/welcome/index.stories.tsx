import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import Layout from './index';

storiesOf('Extension', module).add(
  'Welcome page',
  (): JSX.Element => (
    <Storybook>
      <Layout />
    </Storybook>
  )
);
