import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import * as messages from '../../extension/background/messages';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { randomString } from '../../utils/test/random';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { travelToAccount } from '../account/test/travelToAccount';
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE } from '../paths';
import { handlePassPhrase, handleSecurityHint, submitAccountForm } from '../signup/test/fillSignupForm';
import { travelToSignup } from '../signup/test/travelToSignup';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';

withChainsDescribe('DOM > Feature > Recovery Phrase', () => {
  let store: Store<RootState>;
  let recoveryPhraseDom: React.Component;
  let backButton: Element;
  let exportButton: Element;

  beforeEach(async () => {
    store = aNewStore();
    recoveryPhraseDom = await travelToRecoveryPhrase(store);
    [backButton, exportButton] = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'button');

    const createPersonaResponse: messages.CreatePersonaResponse = {
      accounts: [],
      mnemonic: 'badge cattle stool execute involve main mirror envelope brave scrap involve simple',
      txs: [],
    };
    jest.spyOn(messages, 'sendCreatePersonaMessage').mockResolvedValue(createPersonaResponse);

    const getPersonaResponse: messages.GetPersonaResponse = {
      accounts: [],
      mnemonic: 'badge cattle stool execute involve main mirror envelope brave scrap involve simple',
      txs: [],
    };
    jest.spyOn(messages, 'sendGetPersonaMessage').mockResolvedValue(getPersonaResponse);
  });

  it('has a back button that redirects to the previous route when clicked', async (): Promise<void> => {
    await travelToAccount(store);
    await travelToRecoveryPhrase(store);
    expect(backButton.getAttribute('aria-label')).toBe('Go back');
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(backButton);
      },
    );
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
  });

  it('has an "Export as .PDF" button', () => {
    expect(exportButton.textContent).toBe('Export as .PDF');
  });

  it('shows an empty mnemonic if there is no current Persona', () => {
    const mnemonic = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'p')[1];
    expect(mnemonic.textContent).toBe('');
  });

  it('shows the mnemonic for the current Persona', async (): Promise<void> => {
    //create persona and save mnemonic
    const signupDom = await travelToSignup(store);
    const accountName = randomString(10);
    await submitAccountForm(signupDom, accountName);
    const savedMnemonic = TestUtils.findRenderedDOMComponentWithTag(signupDom, 'p');
    await handlePassPhrase(signupDom);
    await handleSecurityHint(signupDom, accountName);
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);

    //from account view, click on hamburger button
    const accountDom = await travelToAccount(store);
    const hamburgerButton = TestUtils.scryRenderedDOMComponentsWithTag(accountDom, 'button')[0];
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(hamburgerButton);
      },
    );

    //then click on show recovery phrase
    const recoveryPhraseLink = TestUtils.scryRenderedDOMComponentsWithTag(accountDom, 'nav')[2].children[0]
      .children[0];
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(recoveryPhraseLink);
      },
    );

    await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);
    const recoveryPhraseDom = accountDom;

    //when on recovery phrase, compare the shown mnemonic against the saved one
    //FIXME empty mnemonic
    const mnemonic = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'p')[1];
    expect(mnemonic.textContent).toBe(savedMnemonic.textContent);
  });
});
