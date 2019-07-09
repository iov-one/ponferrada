import { Address } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { Request, SignAndPostData } from '../../extension/background/model/signingServer/requestQueueManager';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import { ACCOUNT_STATUS_PAGE } from '../account/index.stories';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';
import { getCashTransaction, getUsernameTransaction } from './test';

const TX_REQUEST_PATH = `${CHROME_EXTENSION_ROOT}/Transaction Request`;
const SHOW_TX_REQUEST_PAGE = 'Show TX Request page';
const SHOW_USERNAME_REQUEST_PAGE = 'Show USERNAME Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

const txRequest: Request<SignAndPostData> = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  data: {
    senderUrl: 'http://localhost/',
    creator: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5aaaaaa' as Address,
    tx: getCashTransaction(),
  },
};

const usernameRequest: Request<SignAndPostData> = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  data: {
    senderUrl: 'http://localhost/',
    creator: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5aaaaaa' as Address,
    tx: getUsernameTransaction(),
  },
};

storiesOf(TX_REQUEST_PATH, module)
  .add(SHOW_TX_REQUEST_PAGE, () => {
    const { creator, tx } = txRequest.data;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          creator={creator}
          sender={txRequest.data.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(SHOW_USERNAME_REQUEST_PAGE, () => {
    const { creator, tx } = usernameRequest.data;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          creator={creator}
          sender={usernameRequest.data.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(REJECT_REQUEST_PAGE, () => (
    <Storybook>
      <RejectRequest
        sender={txRequest.data.senderUrl}
        onBack={linkTo(TX_REQUEST_PATH, SHOW_TX_REQUEST_PAGE)}
        onRejectRequest={action('onAcceptRequest')}
      />
    </Storybook>
  ));
