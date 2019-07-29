import { TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PageMenu from '../../components/PageMenu';
import { BalanceState } from '../../store/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Layout from './components/index';

export const BALANCE_STORY_PATH = `${WALLET_ROOT}/Balance`;
export const BALANCE_STORY_VIEW_PATH = 'View';

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

storiesOf(BALANCE_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(BALANCE_STORY_VIEW_PATH, () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          iovAddress={ACCOUNT_NAME}
          balances={BALANCE}
          onReceivePayment={action('onReceivePayment')}
          onSendPayment={action('onSendPayment')}
        />
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add('View without tokens and without name', () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          iovAddress={undefined}
          balances={NO_BALANCE}
          onReceivePayment={action('onReceivePayment')}
          onSendPayment={action('onSendPayment')}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
