import { TokenTicker } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { GetPersonaResponse } from '../../extension/background/model/backgroundscript';
import { PersonaAcccount, ProcessedTx } from '../../extension/background/model/persona';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
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
