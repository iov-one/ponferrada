import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { travelToLogin } from './test/travelToLogin';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';

describe('DOM > Feature > Login', (): void => {
  let store: Store<RootState>;

  beforeEach(
    (): void => {
      store = aNewStore();
    }
  );

  it(`should two inputs and one button`, async (): Promise<void> => {
    const LoginDom = await travelToLogin(store);

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      LoginDom,
      'input'
    );

    expect(inputs.length).toBe(2);

    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
      LoginDom,
      'button'
    );
    expect(buttons.length).toBe(1);

    //Bottom links
    const links = TestUtils.scryRenderedDOMComponentsWithTag(LoginDom, 'h6');

    expect(links.length).toBe(2);
    expect(links[0].innerHTML).toBe('Restore account');
    expect(links[1].innerHTML).toBe('More options');
    const moreOptionsLink = links[1].parentElement as Element;
    expect(moreOptionsLink).not.toBeNull();
    expect(moreOptionsLink.tagName.toLowerCase()).toBe('a');

    TestUtils.act(
      (): void => {
        TestUtils.Simulate.click(moreOptionsLink);
      }
    );

    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);
});
