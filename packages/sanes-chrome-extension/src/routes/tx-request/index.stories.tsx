import {
  Address,
  Algorithm,
  Amount,
  ChainId,
  PublicIdentity,
  PublicKeyBytes,
  SendTransaction,
  TokenTicker,
} from '@iov/bcp';
import { Encoding } from '@iov/encoding';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import {
  Request,
  SignAndPostRequest,
} from '../../extension/background/model/signingServer/requestQueueManager';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import { ACCOUNT_STATUS_PAGE } from '../account/index.stories';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const TX_REQUEST_PATH = `${CHROME_EXTENSION_ROOT}/Transaction Request`;
const SHOW_REQUEST_PAGE = 'Show Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

const defaultCreator: PublicIdentity = {
  chainId: 'some-chain' as ChainId,
  pubkey: {
    algo: Algorithm.Ed25519,
    // Random 32 bytes pubkey. Derived IOV address:
    // tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3 / 6e1114f57410d8e7bcd910a568c9196efc1479e4
    data: Encoding.fromHex(
      '7196c465e4c95b3dce425784f51936b95da6bc58b3212648cdca64ee7198df47',
    ) as PublicKeyBytes,
  },
};

const defaultAmount: Amount = {
  quantity: '1000000001',
  fractionalDigits: 9,
  tokenTicker: 'CASH' as TokenTicker,
};

const transaction: SendTransaction = {
  kind: 'bcp/send',
  creator: defaultCreator,
  amount: defaultAmount,
  recipient: 'tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f' as Address,
  memo: 'paid transaction',
  fee: {
    tokens: defaultAmount,
  },
};

const request: Request = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  data: {
    senderUrl: 'http://localhost/',
    tx: transaction,
  },
  type: 'signAndPost',
};

storiesOf(TX_REQUEST_PATH, module)
  .add(
    SHOW_REQUEST_PAGE,
    (): JSX.Element => {
      const { tx } = request.data as SignAndPostRequest;

      return (
        <Storybook>
          <ShowRequest
            tx={tx}
            sender={request.data.senderUrl}
            onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
            showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
          />
        </Storybook>
      );
    },
  )
  .add(
    REJECT_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <RejectRequest
          sender={request.data.senderUrl}
          onBack={linkTo(TX_REQUEST_PATH, SHOW_REQUEST_PAGE)}
          onRejectRequest={action('onAcceptRequest')}
        />
      </Storybook>
    ),
  );
