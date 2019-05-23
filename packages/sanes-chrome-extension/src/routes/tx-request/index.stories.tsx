import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import { Request } from '../../extension/background/actions/createPersona/requestHandler';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import { ACCOUNT_STATUS_PAGE } from '../account/index.stories';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const TX_REQUEST_PATH = `${CHROME_EXTENSION_ROOT}/Transaction Request`;
const SHOW_REQUEST_PAGE = 'Show Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

const request: Request = {
  id: 0,
  accept: () => action('accept request'),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? 'yes' : 'no'}`),
  reason: 'I would like you to sign this TX',
  data: {
    senderUrl: 'http://localhost/',
    tx: {},
  },
  type: 'signAndPost',
};

storiesOf(TX_REQUEST_PATH, module)
  .add(
    SHOW_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <ShowRequest
          sender={request.data.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    ),
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
