import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import ShowRequest from './components/ShowRequest';
import AcceptRequest from './components/AcceptRequest';
import { action } from '@storybook/addon-actions';

storiesOf('Extension/Share Identity', module)
  .add(
    'Show Request page',
    (): JSX.Element => (
      <Storybook>
        <ShowRequest showAcceptView={action('showAcceptView')} />
      </Storybook>
    )
  )
  .add(
    'Accept Request page',
    (): JSX.Element => (
      <Storybook>
        <AcceptRequest onBack={action('onBack')} onAcceptRequest={action('onAcceptRequest')} />
      </Storybook>
    )
  );
