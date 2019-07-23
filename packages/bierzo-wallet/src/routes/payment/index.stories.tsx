import { TokenTicker } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import React from 'react';
import { DeepPartial } from 'redux';

import { BalanceState } from '../../store/balances';
import { RootState } from '../../store/reducers';
import { padAmount, stringToAmount } from '../../utils/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import { CURRENCY_FIELD, QUANTITY_FIELD } from './components/CurrencyToSend';
import Layout from './components/index';

const BALANCES: BalanceState = {
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

const fullStore = (): DeepPartial<RootState> => {
  return {
    balances: BALANCES,
  };
};

async function onSubmit(values: object): Promise<void> {
  const formValues = values as FormValues;
  console.log('onSubmit');
  console.log(formValues);
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
