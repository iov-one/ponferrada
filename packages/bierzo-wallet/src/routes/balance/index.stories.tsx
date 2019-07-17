import { TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PageMenu from '../../components/PageMenu';
import { BalanceState } from '../../store/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Layout from './components/index';

const BALANCE: BalanceState = {
  BASH: {
    quantity: '82500',
    fractionalDigits: 4,
    tokenTicker: 'BASH' as TokenTicker,
  },
  CASH: {
    quantity: '1226775',
    fractionalDigits: 5,
    tokenTicker: 'CASH' as TokenTicker,
  },
};

const NO_BALANCE = {};

const ACCOUNT_NAME = 'adolfo*iov';

storiesOf(`${WALLET_ROOT}/balance`, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add('View', () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          name={ACCOUNT_NAME}
          tokens={BALANCE}
          onReceivePayment={action('onReceivePayment')}
          onSendPayment={action('onSendPayment')}
        />
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add('View without tokens', () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          name={ACCOUNT_NAME}
          tokens={NO_BALANCE}
          onReceivePayment={action('onReceivePayment')}
          onSendPayment={action('onSendPayment')}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
