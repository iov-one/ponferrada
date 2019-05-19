import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { WELCOME_ROUTE } from '../paths';
import { travelToRecoveryPhrase } from './test/travelToRecoveryPhrase';

withChainsDescribe('DOM > Feature > Recovery Phrase', () => {
  let store: Store<RootState>;

  beforeEach(
    (): void => {
      store = aNewStore();
    },
  );

  it(`should contain mnemonic string and one cancel button`, async (): Promise<void> => {
    const RecoveryPhraseDom = await travelToRecoveryPhrase(store);

    //Check for mnemonic text
    const paragraph = TestUtils.findRenderedDOMComponentWithTag(RecoveryPhraseDom, 'p');

    const phraseParagraph = paragraph.innerHTML;
    expect(phraseParagraph).toBe('');

    //Check "Back" button behavior
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(RecoveryPhraseDom, 'button');

    expect(buttons.length).toBe(2);

    const backBtn = buttons[1];
    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(backBtn);
      },
    );

    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);
});
