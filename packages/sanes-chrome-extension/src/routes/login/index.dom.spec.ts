import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { travelToLogin } from './test/travelToLogin';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { WELCOME_ROUTE } from '../paths';

describe('DOM > Feature > Login', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  it(`should two inputs and one button`, async () => {
    const LoginDom = await travelToLogin(store);

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
      LoginDom,
      'input'
    );

    expect(inputs.length).toBe(2);

    TestUtils.findRenderedDOMComponentWithTag(LoginDom, 'button');

    //Bottom links
    const links = TestUtils.scryRenderedDOMComponentsWithTag(LoginDom, 'h6');

    expect(links.length).toBe(2);
    const moreOptionsLink = links[1];
    TestUtils.act(() => {
      TestUtils.Simulate.click(moreOptionsLink);
    });

    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);
});
