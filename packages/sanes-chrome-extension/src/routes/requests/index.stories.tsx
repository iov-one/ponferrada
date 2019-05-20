import { storiesOf } from '@storybook/react';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import { RequestProvider } from '../../context/RequestProvider';
import { Request } from '../../extension/background/actions/createPersona/requestHandler';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import Requests from './index';

const intialRequests: Request[] = [
  {
    reason: 'Asking for identities for changing the world',
    sender: 'https://iov.one',
    accept: () => {},
    reject: () => {},
  },
  {
    reason: 'Asking for signAndPost example',
    sender: 'https://example.foo',
    accept: () => {},
    reject: () => {},
  },
  {
    reason: 'Please sign it asap',
    sender: 'https://bar.baz',
    accept: () => {},
    reject: () => {},
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
