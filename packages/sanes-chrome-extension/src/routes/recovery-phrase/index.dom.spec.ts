import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { getMnemonic } from '../signup/components/ShowPhraseForm';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';
import { sleep } from '../../utils/timer';
import { withChainsDescribe } from '../../utils/test/testExecutor';

withChainsDescribe('DOM > Feature > Recovery Phrase', () => {
  let store: Store<RootState>;

  beforeEach(
    (): void => {
      store = aNewStore();
    }
  );

  it(`should contain mnemonic string and one cancel button`, async (): Promise<
    void
  > => {
    const RecoveryPhraseDom = await travelToRecoveryPhrase(store);

    //Check for mnemonic text
    const paragraph = TestUtils.findRenderedDOMComponentWithTag(
      RecoveryPhraseDom,
      'p'
    );

    // it takes some time until Persona is created and memonic inserted into the UI
    await sleep(1000);

    const phraseParagraph = paragraph.innerHTML;
    expect(phraseParagraph).toBe(await getMnemonic());

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
