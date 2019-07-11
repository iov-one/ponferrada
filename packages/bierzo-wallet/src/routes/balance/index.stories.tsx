import { Amount, TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PageMenu from '../../components/PageMenu';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Layout from './components/index';

const TOKENS: ReadonlyArray<Amount> = [
  {
    quantity: '82500',
    fractionalDigits: 4,
    tokenTicker: 'IOV' as TokenTicker,
  },
  {
    quantity: '1226775',
    fractionalDigits: 5,
    tokenTicker: 'ETH' as TokenTicker,
  },
];

const NO_TOKENS: ReadonlyArray<Amount> = [];

const ACCOUNT_NAME = 'adolfo*iov';

storiesOf(`${WALLET_ROOT}/balance`, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add('View', () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          name={ACCOUNT_NAME}
          tokens={TOKENS}
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
          tokens={NO_TOKENS}
          onReceivePayment={action('onReceivePayment')}
          onSendPayment={action('onSendPayment')}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
