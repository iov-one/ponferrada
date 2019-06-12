import { DRAWER_HTML_ID } from 'medulas-react-components/lib/components/Drawer';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { GetPersonaResponse, PersonaData } from '../../extension/background/model/backgroundscript';
import {
  mockCreatePersona,
  mockPersonaResponse,
  processSignup,
} from '../../extension/background/model/persona/test/persona';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import * as chromeInternalMsgs from '../../utils/chrome';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { travelToAccount } from '../account/test/travelToAccount';
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE } from '../paths';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';

withChainsDescribe('DOM > Feature > Recovery Phrase', () => {
  let store: Store<RootState>;
  let recoveryPhraseDom: React.Component;
  let backButton: Element;
  let exportButton: Element;
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';

  beforeEach(async () => {
    store = aNewStore();
    recoveryPhraseDom = await travelToRecoveryPhrase(store);
    [backButton, exportButton] = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'button');

    const createPersonaResponse: PersonaData = {
      accounts: [],
      mnemonic,
      txs: [],
    };
    jest.spyOn(chromeInternalMsgs, 'createPersona').mockResolvedValue(createPersonaResponse);

    const getPersonaResponse: GetPersonaResponse = {
      accounts: [],
      mnemonic,
      txs: [],
    };
    jest.spyOn(chromeInternalMsgs, 'getPersonaData').mockResolvedValue(getPersonaResponse);
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
    const personaMock = mockPersonaResponse([], mnemonic, []);
    mockCreatePersona(personaMock);
    const accountDom = await processSignup(store);
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);

    //from account view, click on hamburger button
    const hamburgerButton = TestUtils.scryRenderedDOMComponentsWithTag(accountDom, 'button')[0];
    expect(hamburgerButton.getAttribute('aria-label')).toBe('Open drawer');
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(hamburgerButton);
      },
    );

    //then click on show recovery phrase
    const hamburgerList = await findRenderedDOMComponentWithId(accountDom, DRAWER_HTML_ID);
    const hamburgerElements = (hamburgerList as Element).querySelectorAll('div > div:nth-of-type(2)');
    if (!hamburgerElements) {
      throw new Error();
    }
    expect(hamburgerElements.length).toBe(2);
    const recoveryPhraseLink = hamburgerElements[0];
    expect(recoveryPhraseLink.textContent).toBe('Recovery words');

    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(recoveryPhraseLink);
      },
    );

    await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);
    const recoveryPhraseDom = accountDom;

    const mnemonicDom = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'p')[1];
    expect(mnemonicDom.textContent).toBe(mnemonic);
  });
});
