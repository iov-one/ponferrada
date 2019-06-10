import { TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { JsonRpcSuccessResponse, parseJsonRpcResponse2 } from '@iov/jsonrpc';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import Backgroundscript, {
  GetPersonaResponse,
  IovWindowExtension,
} from '../../extension/background/model/backgroundscript';
import { Persona, PersonaAcccount, ProcessedTx } from '../../extension/background/model/persona';
import {
  buildGetIdentitiesRequest,
  generateSignAndPostRequest,
  isArrayOfPublicIdentity,
} from '../../extension/background/model/signingServer/test/requestBuilder';
import * as txsUpdater from '../../extension/background/updaters/appUpdater';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { sleep } from '../../utils/timer';
import { travelToAccount } from './test/travelToAccount';

describe('DOM > Feature > Account Status', () => {
  const accountMock: PersonaAcccount = { label: 'Account 0' };
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
  const txMock: ProcessedTx = {
    id: '111',
    recipient: 'Example Recipient',
    signer: 'Example Signer',
    amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
    time: 'Sat May 25 10:10:00 2019 +0200',
    error: null,
    blockExplorerUrl: null,
  };

  const personaMock: GetPersonaResponse = {
    accounts: [accountMock],
    mnemonic,
    txs: [txMock],
  };

  let store: Store<RootState>;
  let accountStatusDom: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    accountStatusDom = await travelToAccount(store, personaMock);
  });

  it('has a hamburger button', () => {
    const hamburgerButton = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, 'button')[0];
    expect(hamburgerButton.getAttribute('aria-label')).toBe('Open drawer');
  });

  it('has a select dropdown with one account', () => {
    const accountInput = TestUtils.findRenderedDOMComponentWithTag(accountStatusDom, 'input');
    expect(accountInput.getAttribute('value')).toBe('Account 0');
  });

  it('has a transactions box with one transaction', () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, 'li')[1];
    const txTime = tx.children[1].children[1].textContent;
    expect(txTime).toBe(txMock.time);
  });
});

describe('DOM > Feature > Account Status', () => {
  it('generates a link insi transaction box for an ethereum transaction', async () => {
    // get Identities
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockImplementation(() => {});
    const background = new Backgroundscript();
    background.registerActionsInBackground(window as IovWindowExtension);

    const signingServer = background['signingServer'];
    const db = background['db'].getDb();
    const mnemonic = 'oxygen fall sure lava energy veteran enroll frown question detail include maximum';
    const password = 'test-password';
    await background['createPersona'](password, mnemonic);
    const persona = background['persona'] as Persona;

    signingServer.start(persona.getCore());
    const sender = { url: 'http://finnex.com' };
    const identitiesRequest = buildGetIdentitiesRequest('getIdentities');
    const responsePromise = signingServer.handleRequestMessage(identitiesRequest, sender);
    await sleep(10);
    signingServer['requestHandler'].next().accept();

    const parsedResponse = parseJsonRpcResponse2(await responsePromise);
    const parsedResult = TransactionEncoder.fromJson((parsedResponse as JsonRpcSuccessResponse).result);
    if (!isArrayOfPublicIdentity(parsedResult)) {
      throw new Error();
    }

    const signRequest = await generateSignAndPostRequest(parsedResult[0]);
    const signResponse = signingServer.handleRequestMessage(signRequest, sender);
    signingServer['requestHandler'].next().accept();
    await signResponse;

    const store = aNewStore();
    const personaInfo = await (window as IovWindowExtension).getPersonaData();
    const accountStatusDom = await travelToAccount(store, personaInfo);

    const links = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, 'a');
    expect(links.length).toBe(1);

    persona.destroy();
    signingServer.shutdown();
    db.close();

    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockReset();
  }, 60000);
});
