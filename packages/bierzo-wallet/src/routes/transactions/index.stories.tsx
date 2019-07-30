import { TokenTicker } from '@iov/bcp';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ReadonlyDate } from 'readonly-date';
import { DeepPartial } from 'redux';

import { ProcessedTx } from '../../store/notifications';
import { RootState } from '../../store/reducers';
import { stringToAmount } from '../../utils/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Payment from './index';

export const TRANSACTIONS_STORY_PATH = `${WALLET_ROOT}/Transactions`;
export const TRANSACTIONS_STORY_SHOW_PATH = 'With transactions';

const txs: ReadonlyArray<ProcessedTx> = [
  {
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    success: true,
    id: 'tx1',
    memo: 'Sample note',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    success: true,
    id: 'tx2',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: false,
    id: 'tx3',
    memo: 'Another note',
  },
  {
    received: true,
    sender: 'Lx9oa7re0894eopiahsdpf98as7y908',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    success: true,
    id: 'tx4',
    memo: 'And again note',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    success: true,
    id: 'tx5',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: false,
    id: 'tx6',
  },
  {
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    success: true,
    id: 'tx7',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    success: true,
    id: 'tx8',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: false,
    id: 'tx9',
  },
  {
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    success: true,
    id: 'tx10',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    success: true,
    id: 'tx11',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: false,
    id: 'tx12',
  },
  {
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    success: true,
    id: 'tx13',
  },
  {
    received: false,
    sender: 'Lxasdoiu9847ioasdpfuy098q23rui',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    success: true,
    id: 'tx14',
  },
  {
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: false,
    id: 'tx15',
  },
];

const txStore: DeepPartial<RootState> = {
  notifications: {
    transactions: txs,
  },
};

storiesOf(TRANSACTIONS_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Without transactions',
    (): JSX.Element => (
      <DecoratedStorybook>
        <Payment />
      </DecoratedStorybook>
    ),
  )
  .add(
    TRANSACTIONS_STORY_SHOW_PATH,
    (): JSX.Element => (
      <DecoratedStorybook storeProps={txStore}>
        <Payment />
      </DecoratedStorybook>
    ),
  );
