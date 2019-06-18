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
    type: 'getIdentities',
    reason: 'Asking for identities for changing the world',
    data: {
      senderUrl: 'Sender 1',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
  },
  {
    id: 1,
    type: 'signAndPost',
    reason: 'Asking for signAndPost example',
    data: {
      senderUrl: 'Sender 2',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
  },
  {
    id: 2,
    type: 'getIdentities',
    reason: 'Please get Identities on new website',
    data: {
      senderUrl: 'Sender 3',
      requestedIdentities: [],
    },
    accept: jest.fn(),
    reject: jest.fn(),
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
