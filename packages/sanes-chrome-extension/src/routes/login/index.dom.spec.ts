import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { click } from '../../utils/test/dom';
import { travelToLogin, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { RESTORE_ACCOUNT } from '../paths';

describe('DOM > Feature > Login', () => {
  let store: Store<RootState>;
  let loginDom: React.Component;
  let restoreAccountLink: Element;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    loginDom = await travelToLogin(store);
    restoreAccountLink = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'a');
  });

  it('has a "Restore account" link that redirects to the Restore Account view when clicked', async () => {
    expect(restoreAccountLink.textContent).toBe('Restore account');

    click(restoreAccountLink);
    await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);
  }, 60000);
});
