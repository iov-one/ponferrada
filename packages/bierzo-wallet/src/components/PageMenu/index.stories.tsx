import { TokenTicker } from '@iov/bcp';
import { storiesOf } from '@storybook/react';
import Typography from 'medulas-react-components/lib/components/Typography';
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
    sender: 'adolfo*iov',
  },
  {
    id: 'tx2',
    recipient: 'moe*iov',
    amount: stringToAmount('0.14', 'IOV' as TokenTicker),
    sender: 'adolfo*iov',
  },
];

const txs: ReadonlyArray<ProcessedTx> = [
  {
    kind: 'bcp/send',
    received: true,
    sender: 'george*iov',
    recipient: 'me',
    amount: stringToAmount('10.5', 'LSK' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx1',
  },
  {
    kind: 'bcp/send',
    received: false,
    sender: 'me',
    recipient: 'alex*iov',
    amount: stringToAmount('25.5', 'IOV' as TokenTicker),
    time: new ReadonlyDate('2018-12-24T10:51:33.763Z'),
    success: true,
    id: 'tx2',
  },
];

const faultTx: ProcessedTx = {
  kind: 'bcp/send',
  received: false,
  sender: 'me',
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
          <Typography variant="h5" color="primary">
            What is Lorem Ipsum?
          </Typography>
          <Typography variant="body1">
            <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Typography>
        </PageMenu>
      </DecoratedStorybook>
    ),
  )
  .add(
    'With padding',
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <PageMenu>
          <Typography variant="h5" color="primary">
            What is Lorem Ipsum?
          </Typography>
          <Typography variant="body1">
            <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Typography>
        </PageMenu>
      </DecoratedStorybook>
    ),
  );
