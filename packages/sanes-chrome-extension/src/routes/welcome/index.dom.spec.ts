import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { WELCOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE, RESTORE_ACCOUNT } from '../paths';
import { history, RootState } from '../../store/reducers';
import { createDom } from '../../utils/test/dom';
import { aNewStore } from '../../store';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { sleep } from '../../utils/timer';

describe('DOM > Feature > Welcome', () => {
  let store: Store<RootState>;
  let dom: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    dom = createDom(store);
    TestUtils.act(() => history.push(WELCOME_ROUTE));
    await sleep(500);
  });

  it('should create Welcome layout view', async () => {
    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);

  it('should create three buttons and redirect to appropriate route when clicking on it', async () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'button');

    expect(buttons.length).toBe(3);

    //Click on login button
    const loginButton = buttons[0];
    TestUtils.act(() => TestUtils.Simulate.click(loginButton));
    await whenOnNavigatedToRoute(store, LOGIN_ROUTE);

    //Click on signup button
    const signUpButton = buttons[1];
    TestUtils.act(() => TestUtils.Simulate.click(signUpButton));
    await whenOnNavigatedToRoute(store, SIGNUP_ROUTE);

    //Click on import button
    const importButton = buttons[2];
    TestUtils.act(() => TestUtils.Simulate.click(importButton));
    await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);
  }, 55000);
});
