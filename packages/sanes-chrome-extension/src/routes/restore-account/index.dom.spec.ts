import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { PersonaData } from '../../extension/background/model/backgroundscript';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import * as chromeInternalMsgs from '../../utils/chrome';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { randomString } from '../../utils/test/random';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import { submitRecoveryPhrase } from './test/fillRecoveryPhrase';
import { travelToRestoreAccount } from './test/travelToRestoreAccount';

withChainsDescribe('DOM > Feature > Restore Account', () => {
  const password = randomString(10);
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';

  const response: PersonaData = {
    accounts: [],
    mnemonic,
    txs: [],
  };

  let store: Store<RootState>;
  let restoreAccountDom: React.Component;

  beforeEach(async () => {
    jest.spyOn(chromeInternalMsgs, 'createPersona').mockResolvedValueOnce(response);

    store = aNewStore();
    restoreAccountDom = await travelToRestoreAccount(store);
  });

  it('should restore profile from mnemonic', async () => {
    await submitRecoveryPhrase(restoreAccountDom, mnemonic, password);
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
  }, 55000);

  it('should warn required mnemonic if empty', async () => {
    const mnemonicForm = TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'form');

    TestUtils.act(() => {
      TestUtils.Simulate.submit(mnemonicForm);
    });

    const validityLabel = TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'p');
    expect(validityLabel.textContent).toBe('Required');
  }, 55000);
});
