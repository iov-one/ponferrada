import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';

import { withChainsDescribe } from '../../utils/test/testExecutor';
import { PersonaManager } from '../../logic/persona';

withChainsDescribe('DOM > Feature > Recovery Phrase', () => {
  let store: Store<RootState>;

  beforeAll(async () => {
    // All tests in this file should use the same persona instance to improve test speed
    await PersonaManager.create();
  });

  beforeEach(
    (): void => {
      store = aNewStore();
    }
  );

  afterAll(() => {
    PersonaManager.destroy();
  });

  it(`should contain mnemonic string and one cancel button`, async (): Promise<
    void
  > => {
    const RecoveryPhraseDom = await travelToRecoveryPhrase(store);

    //Check for mnemonic text
    const paragraph = TestUtils.findRenderedDOMComponentWithTag(
      RecoveryPhraseDom,
      'p'
    );

    const phraseParagraph = paragraph.innerHTML;
    expect(phraseParagraph).toBe(PersonaManager.get().mnemonic);

    //Check "Back" button behavior
    const backBtn = TestUtils.findRenderedDOMComponentWithTag(
      RecoveryPhraseDom,
      'button'
    );

    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(backBtn);
      }
    );

    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);
});
