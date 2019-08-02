import { TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PageMenu from '../../components/PageMenu';
import { BalanceState } from '../../store/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import { PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH } from '../payment/index.stories';
import { RECEIVE_PAYMENT_STORY_PATH } from '../receivePayments/index.stories';
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
          onSendPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onReceivePayment={linkTo(WALLET_ROOT, RECEIVE_PAYMENT_STORY_PATH)}
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
          onSendPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onReceivePayment={linkTo(WALLET_ROOT, RECEIVE_PAYMENT_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
