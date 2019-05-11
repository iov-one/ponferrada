import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import ShowRequest from './components/ShowRequest';
import RejectRequest from './components/RejectRequest';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import { ACCOUNT_STATUS_PAGE } from '../account/index.stories';

const SHARE_IDENTITY_PATH = `${CHROME_EXTENSION_ROOT}/Share Identity`;
const SHOW_REQUEST_PAGE = 'Show Request page';
const REJECT_REQUEST_PAGE = 'Reject Request page';

storiesOf(SHARE_IDENTITY_PATH, module)
  .add(
    SHOW_REQUEST_PAGE,
    (): JSX.Element => (
      <Storybook>
        <ShowRequest
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(SHARE_IDENTITY_PATH, REJECT_REQUEST_PAGE)}
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
