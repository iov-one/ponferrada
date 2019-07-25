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
import { getCashTransaction, getEthTransaction, getUsernameTransaction } from './test';

const TX_REQUEST_PATH = `${CHROME_EXTENSION_ROOT}/Transaction Request`;
const SHOW_TX_REQUEST_PAGE = 'Show TX Request page';
const SHOW_ETHEREUM_TX_REQUEST_PAGE = 'Show TX Request page (Ethereum)';
const SHOW_USERNAME_REQUEST_PAGE = 'Show USERNAME Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

const txRequest: Request<SignAndPostData> = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  responseData: {
    senderUrl: 'http://localhost/',
    tx: getCashTransaction(),
  },
};

const ethereumTxRequest: Request<SignAndPostData> = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this Ethereum TX',
  responseData: {
    senderUrl: 'http://localhost/',
    tx: getEthTransaction(),
  },
};

const usernameRequest: Request<SignAndPostData> = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  responseData: {
    senderUrl: 'http://localhost/',
    tx: getUsernameTransaction(),
  },
};

storiesOf(TX_REQUEST_PATH, module)
  .add(SHOW_TX_REQUEST_PAGE, () => {
    const { tx } = txRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          sender={txRequest.responseData.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(SHOW_ETHEREUM_TX_REQUEST_PAGE, () => {
    const { tx, senderUrl } = ethereumTxRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          sender={senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(SHOW_USERNAME_REQUEST_PAGE, () => {
    const { tx } = usernameRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          sender={usernameRequest.responseData.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(REJECT_REQUEST_PAGE, () => (
    <Storybook>
      <RejectRequest
        sender={txRequest.responseData.senderUrl}
        onBack={linkTo(TX_REQUEST_PATH, SHOW_TX_REQUEST_PAGE)}
        onRejectRequest={action('onAcceptRequest')}
      />
    </Storybook>
  ));
