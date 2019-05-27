import { TokenTicker } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import * as messages from '../../extension/background/messages';
import { CreatePersonaResponse, GetPersonaResponse } from '../../extension/background/messages';
import { PersonaAcccount, ProcessedTx } from '../../logic/persona';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import { processSignUp } from '../signup/test/travelToSignup';
import { travelToAccount } from './test/travelToAccount';

withChainsDescribe('DOM > Feature > Account Status', () => {
  const accountMock: PersonaAcccount = { label: 'Account 0' };
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
  const txMock: ProcessedTx = {
    id: '111',
    recipient: 'Example Recipient',
    signer: 'Example Signer',
    amount: { quantity: '10', fractionalDigits: 3, tokenTicker: 'ETH' as TokenTicker },
    time: 'Sat May 25 10:10:00 2019 +0200',
    error: null,
  };

  const createPersonaResponse: CreatePersonaResponse = {
    accounts: [accountMock],
    mnemonic,
    txs: [txMock],
  };

  const getPersonaResponse: GetPersonaResponse = {
    accounts: [accountMock],
    mnemonic,
    txs: [txMock],
  };

  let store: Store<RootState>;
  let accountStatusDom: React.Component;

  beforeEach(async () => {
    store = aNewStore();

    jest.spyOn(messages, 'sendCreatePersonaMessage').mockResolvedValue(createPersonaResponse);

    await processSignUp(store);
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);

    accountStatusDom = await travelToAccount(store, getPersonaResponse);
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
