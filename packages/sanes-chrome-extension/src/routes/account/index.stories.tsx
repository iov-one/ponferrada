import {
  Address,
  Algorithm,
  ChainId,
  Identity,
  PubkeyBytes,
  SendTransaction,
  TokenTicker,
  WithCreator,
} from '@iov/bcp';
import { RegisterUsernameTx } from '@iov/bns';
import { Encoding } from '@iov/encoding';
import { ethereumCodec } from '@iov/ethereum';
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

const defaultCreator: Identity = {
  chainId: 'foobar' as ChainId,
  pubkey: {
    algo: Algorithm.Secp256k1,
    // Random Ethereum pubkey. Derived address: 0x7c15484EA11FD233AE566469af15d84335023c30
    data: Encoding.fromHex(
      '0434ce248a6a5979c04d75d1a75907b2bec1cb4d4f6e17b76521f0925e8b6b40e00711fe98e789cf5c8317cf1e731b3101e9dbfaba5e351e424e45c9a2f4dfb63c',
    ) as PubkeyBytes,
  },
};

const send: SendTransaction & WithCreator = {
  kind: 'bcp/send',
  amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
  creator: defaultCreator,
  sender: ethereumCodec.identityToAddress(defaultCreator),
  fee: {
    gasLimit: '12345678',
    gasPrice: { quantity: '20000000000', fractionalDigits: 18, tokenTicker: 'ETH' as TokenTicker },
  },
  memo: 'A little donation',
  recipient: '0x1212121212121212121212121212121212121212' as Address,
};

const usernameCreate: RegisterUsernameTx & WithCreator = {
  kind: 'bns/register_username',
  creator: defaultCreator,
  fee: {
    gasLimit: '12345678',
    gasPrice: { quantity: '20000000000', fractionalDigits: 18, tokenTicker: 'ETH' as TokenTicker },
  },
  username: 'test',
  targets: [
    { chainId: 'foobar' as ChainId, address: 'tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f' as Address },
  ],
};

let txId = 111;

const processedTx: ProcessedTx = {
  id: (txId++).toString(),
  signer: 'Example Signer',
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: null,
  blockExplorerUrl: null,
  original: send,
};

const blockExplorerProcessedTx: ProcessedTx = {
  id: (txId++).toString(),
  signer: 'Example Signer',
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: null,
  blockExplorerUrl: 'https://iov.one',
  original: send,
};

const usernameCreatedTx: ProcessedTx = {
  id: (txId++).toString(),
  signer: 'Example Signer',
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: null,
  blockExplorerUrl: null,
  original: usernameCreate,
};
const errorUsernameCreatedTx: ProcessedTx = {
  id: (txId++).toString(),
  signer: 'Example Signer',
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: 'This is an example of reported error',
  blockExplorerUrl: null,
  original: usernameCreate,
};

const errorProcessedTx: ProcessedTx = {
  id: (txId++).toString(),
  signer: 'Example Signer',
  time: 'Sat May 25 10:10:00 2019 +0200',
  error: 'This is an example of reported error',
  blockExplorerUrl: null,
  original: send,
};

storiesOf(`${CHROME_EXTENSION_ROOT}/${ACCOUNT_STATUS_PAGE}`, module)
  .add('Txs', () => {
    const processedTx2 = { ...processedTx, id: (txId++).toString() };
    const processedTx3 = { ...processedTx, id: (txId++).toString() };

    const persona: GetPersonaResponse = {
      mnemonic: '',
      accounts: [{ label: 'Account 0' }],
      txs: [
        usernameCreatedTx,
        errorUsernameCreatedTx,
        blockExplorerProcessedTx,
        processedTx,
        errorProcessedTx,
        processedTx2,
        processedTx3,
      ],
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
