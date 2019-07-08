import { TokenTicker } from '@iov/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ReadonlyDate } from 'readonly-date';
import { DeepPartial } from 'redux';

import { ProcessedTx, Tx } from '../../store/notifications';
import { RootState } from '../../store/reducers';
import { stringToAmount } from '../../utils/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import PageMenu from './index';

const pendingTxs: ReadonlyArray<Tx> = [
  {
    id: 'tx1',
    recipient: 'alex*iov',
    amount: stringToAmount('12.5', 'IOV' as TokenTicker),
    signer: 'adolfo*iov',
  },
  {
    id: 'tx2',
    recipient: 'moe*iov',
    amount: stringToAmount('0.14', 'IOV' as TokenTicker),
    signer: 'adolfo*iov',
  },
];

const txs: ReadonlyArray<ProcessedTx> = [
  {
    received: true,
    signer: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx1',
  },
  {
    received: false,
    signer: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx2',
  },
];

const faultTx: ProcessedTx = {
  received: false,
  signer: 'me',
  recipient: 'alex*iov',
  amount: stringToAmount('100.5', 'IOV' as TokenTicker),
  time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
  success: false,
  id: 'tx3',
};

const fullStore = (): DeepPartial<RootState> => {
  const fullTxs = [faultTx, ...txs];

  return {
    notifications: {
      pending: pendingTxs,
      transactions: fullTxs,
    },
  };
};

storiesOf(`${WALLET_ROOT}/Components/PageMenu`, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Without padding',
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <PageMenu padding={false}>
          <React.Fragment>Some content</React.Fragment>
        </PageMenu>
      </DecoratedStorybook>
    ),
  )
  .add(
    'With padding',
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <PageMenu>
          <React.Fragment>Some content</React.Fragment>
        </PageMenu>
      </DecoratedStorybook>
    ),
  );
