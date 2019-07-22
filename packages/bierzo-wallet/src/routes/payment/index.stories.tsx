import { TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { DeepPartial } from 'redux';

import { BalanceState } from '../../store/balances';
import { RootState } from '../../store/reducers';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Layout from './components/index';

const fullStore = (): DeepPartial<RootState> => {
  return {
    balances: {
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
    },
  };
};

async function onSubmit(values: object): Promise<void> {
  console.log(values);
  action(JSON.stringify(values, undefined, 2));
  return;
}

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Payment page',
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <Layout onCancelPayment={action('onCancelPayment')} onSubmit={onSubmit} />
      </DecoratedStorybook>
    ),
  );
