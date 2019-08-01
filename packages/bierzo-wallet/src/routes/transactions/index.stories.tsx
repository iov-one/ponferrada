import { TokenTicker } from '@iov/bcp';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ReadonlyDate } from 'readonly-date';

import { ProcessedTx } from '../../store/notifications';
import { RootState } from '../../store/reducers';
import { stringToAmount } from '../../utils/balances';
import DecoratedStorybook, { WALLET_ROOT } from '../../utils/storybook';
import Payment from './index';

export const TRANSACTIONS_STORY_PATH = `${WALLET_ROOT}/Transactions`;
export const TRANSACTIONS_STORY_SHOW_PATH = 'With transactions';

const txs: ReadonlyArray<ProcessedTx> = [
  {
    kind: 'bcp/send',
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    id: 'tx1',
    memo: 'Sample note',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    id: 'tx2',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    id: 'tx3',
    memo: 'Another note',
  },
  {
    kind: 'bcp/send',
    received: true,
    sender: 'Lx9oa7re0894eopiahsdpf98as7y908',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    id: 'tx4',
    memo: 'And again note',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    id: 'tx5',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    id: 'tx6',
  },
  {
    kind: 'bcp/send',
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    id: 'tx7',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    id: 'tx8',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    id: 'tx9',
  },
  {
    kind: 'bcp/send',
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    id: 'tx10',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    id: 'tx11',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    id: 'tx12',
  },
  {
    kind: 'bcp/send',
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-11-13T05:35:03.763Z'),
    id: 'tx13',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'Lxasdoiu9847ioasdpfuy098q23rui',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-10-05T16:12:00.763Z'),
    id: 'tx14',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('100.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    id: 'tx15',
  },
];

const txStore: Pick<RootState, 'notifications'> = {
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
