import { TokenTicker } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { JsonRpcSuccessResponse, parseJsonRpcResponse2 } from '@iov/jsonrpc';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import Backgroundscript, { IovWindowExtension } from '../../extension/background/model/backgroundscript';
import { Persona, PersonaAcccount, ProcessedTx } from '../../extension/background/model/persona';
import { mockPersonaResponse } from '../../extension/background/model/persona/test/persona';
import {
  buildGetIdentitiesRequest,
  generateSignAndPostRequest,
  isArrayOfPublicIdentity,
} from '../../extension/background/model/signingServer/test/requestBuilder';
import * as txsUpdater from '../../extension/background/updaters/appUpdater';
import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { click } from '../../utils/test/dom';
import { travelToAccount, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import * as Drawer from '../account/test/drawer';
import { RECOVERY_PHRASE_ROUTE, REQUEST_ROUTE } from '../paths';
import { checkCreateAccount } from './test/operateAccount';

describe('DOM > Feature > Account Status', () => {
  const ACCOUNT = 'Account 0';
  const accountMock: PersonaAcccount = { label: ACCOUNT };
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
  const txMock: ProcessedTx = {
    id: '111',
    recipient: 'Example Recipient',
    signer: 'Example Signer',
    amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
    time: 'Sat May 25 10:10:00 2019 +0200',
    blockExplorerUrl: 'www.blockexplorer.com',
    error: null,
  };
  const personaMock = mockPersonaResponse([accountMock], mnemonic, [txMock]);

  let store: Store<RootState>;
  let accountStatusDom: React.Component;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    accountStatusDom = await travelToAccount(store, personaMock);
  }, 60000);

  it('redirects to the Recovery Phrase view when link clicked in Drawer menu', async () => {
    Drawer.clickRecoveryPhrase(accountStatusDom);
    await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);
  }, 60000);

  it('redirects to the Requests view when link clicked in Drawer menu', async () => {
    Drawer.clickRequests(accountStatusDom);
    await whenOnNavigatedToRoute(store, REQUEST_ROUTE);
  }, 60000);

  it('redirects to the Terms and Conditions page', async () => {
    Object.defineProperty(window, 'open', {
      configurable: true,
    });
    window.open = jest.fn();

    Drawer.clickTerms(accountStatusDom);
    await sleep(1000);
    expect(window.open).toHaveBeenCalledWith('https://support.iov.one/hc/en-us', '_blank');
  }, 60000);

  it('has a select dropdown that enables the creation and selection of accounts', async () => {
    const accountInput = TestUtils.findRenderedDOMComponentWithTag(accountStatusDom, 'input');
    expect(accountInput.getAttribute('value')).toBe(ACCOUNT);

    await click(accountInput);
    await checkCreateAccount(accountStatusDom);
  }, 60000);

  it('has a transactions box with one transaction', () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, 'li')[1];
    const txTime = tx.children[1].children[1].textContent;
    expect(txTime).toBe(txMock.time);
  }, 60000);
});

withChainsDescribe('DOM > Feature > Account Status', () => {
  it('generates a link inside transaction box for an ethereum transaction', async () => {
    // Simulate we start background page
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockImplementation(() => {});
    const background = new Backgroundscript();
    background.registerActionsInBackground(window as IovWindowExtension);

    // Create a persona
    const signingServer = background['signingServer'];
    const db = background['db'].getDb();
    const mnemonic = 'oxygen fall sure lava energy veteran enroll frown question detail include maximum';
    const password = 'test-password';
    await background['createPersona'](password, mnemonic);
    const persona = background['persona'] as Persona;

    // Accept getIdentities request
    const sender = { url: 'http://finnex.com' };
    const identitiesRequest = buildGetIdentitiesRequest('getIdentities');
    const responsePromise = signingServer.handleRequestMessage(identitiesRequest, sender);
    await sleep(10);
    signingServer['requestHandler'].next().accept();

    // Accept signAndPost request
    const parsedResponse = parseJsonRpcResponse2(await responsePromise);
    const parsedResult = TransactionEncoder.fromJson((parsedResponse as JsonRpcSuccessResponse).result);
    if (!isArrayOfPublicIdentity(parsedResult)) {
      throw new Error();
    }
    const signRequest = await generateSignAndPostRequest(parsedResult[0]);
    const signResponse = signingServer.handleRequestMessage(signRequest, sender);
    signingServer['requestHandler'].next().accept();
    await signResponse;

    // Launch react DOM with account status route
    const store = aNewStore();
    const personaInfo = await (window as IovWindowExtension).getPersonaData();
    const accountStatusDom = await travelToAccount(store, personaInfo);

    // Check for the link
    const links = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, 'a');
    expect(links.length).toBe(1);

    // Clean everything
    persona.destroy();
    signingServer.shutdown();
    db.close();
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockReset();
  }, 60000);
});
