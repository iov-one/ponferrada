import { Address } from '@iov/bcp';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { GetIdentitiesRequest } from '../../extension/background/model/signingServer/requestQueueManager';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import { ACCOUNT_STATUS_PAGE } from '../account/index.stories';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const SHARE_IDENTITY_PATH = `${CHROME_EXTENSION_ROOT}/Share Identity`;
const SHOW_REQUEST_PAGE = 'Show Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

const data: GetIdentitiesRequest = {
  senderUrl: 'http://finnex.com',
  requestedIdentities: [
    {
      name: 'Ganache',
      address: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa' as Address,
    },
    {
      name: 'Ganache',
      address: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa' as Address,
    },
    {
      name: 'Ganache',
      address: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa' as Address,
    },
    {
      name: 'Ganache',
      address: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa' as Address,
    },
  ],
};

storiesOf(SHARE_IDENTITY_PATH, module)
  .add(
    SHOW_REQUEST_PAGE,
    (): JSX.Element => {
      return (
        <Storybook>
          <ShowRequest
            data={data.requestedIdentities}
            sender={data.senderUrl}
            onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
            showRejectView={linkTo(SHARE_IDENTITY_PATH, REJECT_REQUEST_PAGE)}
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
          sender={data.senderUrl}
          onBack={linkTo(SHARE_IDENTITY_PATH, SHOW_REQUEST_PAGE)}
          onRejectRequest={action('onAcceptRequest')}
        />
      </Storybook>
    ),
  );
