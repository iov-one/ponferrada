import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';

import { RequestProvider } from '../../context/RequestProvider';
import { Request } from '../../extension/background/model/signingServer/requestQueueManager';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import Requests from './index';

const intialRequests: Request[] = [
  {
    id: 0,
    reason: 'Asking for identities for changing the world',
    responseData: {
      senderUrl: 'Sender 1',
      requestedIdentities: [],
    },
    accept: action('accept'),
    reject: action('reject'),
  },
  {
    id: 1,
    reason: 'Asking for signAndPost example',
    responseData: {
      senderUrl: 'Sender 2',
      requestedIdentities: [],
    },
    accept: action('accept'),
    reject: action('reject'),
  },
  {
    id: 2,
    reason: 'Please get Identities on new website',
    responseData: {
      senderUrl: 'Sender 3',
      requestedIdentities: [],
    },
    accept: action('accept'),
    reject: action('reject'),
  },
];

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  'Request queue page',
  (): JSX.Element => (
    <Storybook>
      <RequestProvider initialRequests={intialRequests}>
        <Requests />
      </RequestProvider>
    </Storybook>
  ),
);
