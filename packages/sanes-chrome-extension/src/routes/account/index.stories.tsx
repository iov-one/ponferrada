import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import Layout from './index';

const blockchainAccounts = ['Main', 'Savings'];

storiesOf('Routes/Account', module).add('Show account status', () => (
  <Storybook>
    <Layout blockchainAccounts={blockchainAccounts} />
  </Storybook>
));
