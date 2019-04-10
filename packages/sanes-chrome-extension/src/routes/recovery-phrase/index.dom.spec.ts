import { Store } from 'redux';
import { RootState, history } from '../../store/reducers';
import { getMnemonic } from '../signup/components/ShowPhraseForm';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';

describe('DOM > Feature > Recovery Phrase', (): void => {
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
    const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
      RecoveryPhraseDom,
      'p'
    );

    expect(paragraphs.length).toBe(1);
    const phraseParagraph = paragraphs[0].innerHTML;
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
