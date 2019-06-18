import { TokenTicker } from '@iov/bcp';
import { storiesOf } from '@storybook/react';
import { ToastProvider } from 'medulas-react-components/lib/context/ToastProvider';
import { Storybook } from 'medulas-react-components/lib/utils/storybook';
import React from 'react';
import { PersonaProvider } from '../../context/PersonaProvider';
import { GetPersonaResponse } from '../../extension/background/model/backgroundscript';
import { ProcessedTx } from '../../extension/background/model/persona';
import { CHROME_EXTENSION_ROOT } from '../../utils/storybook';
import Layout from './index';

export const ACCOUNT_STATUS_PAGE = 'Account Status page';

const processedTx: ProcessedTx = {
  id: '111',
  recipient: 'Example Recipient',
  signer: 'Example Signer',
  amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: null,
  blockExplorerUrl: null,
};

const blockExplorerProcessedTx = {
  id: '112',
  recipient: 'Example Recipient',
  signer: 'Example Signer',
  amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: null,
  blockExplorerUrl: 'https://iov.one',
};

const errorProcessedTx = {
  id: '113',
  recipient: 'Example Recipient',
  signer: 'Example Signer',
  amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: 'This is an example of reported error',
  blockExplorerUrl: null,
};

storiesOf(`${CHROME_EXTENSION_ROOT}/${ACCOUNT_STATUS_PAGE}`, module)
  .add('Txs', () => {
    const processedTx2 = { ...processedTx, id: '114' };
    const processedTx3 = { ...processedTx, id: '115' };

    const persona: GetPersonaResponse = {
      mnemonic: '',
      accounts: [{ label: 'Account 0' }],
      txs: [blockExplorerProcessedTx, processedTx, errorProcessedTx, processedTx2, processedTx3],
    };

    return (
      <PersonaProvider persona={persona}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  })
  .add('Empty', () => {
    const persona: GetPersonaResponse = {
      mnemonic: '',
      accounts: [{ label: 'Account 0' }],
      txs: [],
    };

    return (
      <PersonaProvider persona={persona}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  });
