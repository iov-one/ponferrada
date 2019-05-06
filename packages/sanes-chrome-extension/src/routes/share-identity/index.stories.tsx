import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import ShowRequest from './components/ShowRequest';
import AcceptRequest from './components/AcceptRequest';
import RejectRequest from './components/RejectRequest';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

storiesOf('Extension/Share Identity', module)
  .add(
    'Show Request page',
    (): JSX.Element => (
      <Storybook>
        <ShowRequest
          showAcceptView={linkTo('Routes/Share Identity', 'Accept request')}
          showRejectView={linkTo('Routes/Share Identity', 'Accept request')}
        />
      </Storybook>
    )
  )
  .add(
    'Accept Request page',
    (): JSX.Element => (
      <Storybook>
        <AcceptRequest
          onBack={linkTo('Routes/Share Identity', 'Show request')}
          onAcceptRequest={action('onAcceptRequest')}
        />
      </Storybook>
    )
  )
  .add(
    'Reject request',
    (): JSX.Element => (
      <Storybook>
        <RejectRequest
          onBack={linkTo('Routes/Share Identity', 'Show request')}
          onRejectRequest={action('onAcceptRequest')}
        />
      </Storybook>
    )
  );
