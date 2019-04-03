import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import TestUtils from 'react-dom/test-utils';
import { travelToLogin } from './test/travelToLogin';

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
  }, 55000);
});
