import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import ShowRequest from './components/ShowRequest';
import AcceptRequest from './components/AcceptRequest';
import RejectRequest from './components/RejectRequest';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';

const SHARE_IDENTITY_PATH = `${CHROME_EXTENSION_ROOT}/Share Identity`;
const SHOW_REQUEST_PAGE = 'Show Request page';
const ACCEPT_REQUEST_PAGE = 'Accept Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

storiesOf(SHARE_IDENTITY_PATH, module)
  .add(
    SHOW_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <ShowRequest
          showAcceptView={linkTo(SHARE_IDENTITY_PATH, ACCEPT_REQUEST_PAGE)}
          showRejectView={linkTo(SHARE_IDENTITY_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    )
  )
  .add(
    ACCEPT_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <AcceptRequest
          onBack={linkTo(SHARE_IDENTITY_PATH, SHOW_REQUEST_PAGE)}
          onAcceptRequest={action('onAcceptRequest')}
        />
      </Storybook>
    )
  )
  .add(
    REJECT_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <RejectRequest
          onBack={linkTo(SHARE_IDENTITY_PATH, SHOW_REQUEST_PAGE)}
          onRejectRequest={action('onAcceptRequest')}
        />
      </Storybook>
    )
  );
