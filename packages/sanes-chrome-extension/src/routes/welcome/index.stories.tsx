import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { storiesOf } from '@storybook/react';

import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import Layout from './index';

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Welcome page',
  (): JSX.Element => (
    <Storybook>
      <Layout />
    </Storybook>
  ),
);
