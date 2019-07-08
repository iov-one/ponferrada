import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { click } from '../../utils/test/dom';
import { travelToWelcome, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { LOGIN_ROUTE, RESTORE_ACCOUNT, SIGNUP_ROUTE } from '../paths';

describe('DOM > Feature > Welcome', () => {
  let store: Store<RootState>;
  let welcomeDom: React.Component;
  let buttons: Element[];
  let logInButton: Element;
  let newAccountButton: Element;
  let importAccountButton: Element;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    welcomeDom = await travelToWelcome(store);
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(welcomeDom, 'button');
    [logInButton, newAccountButton, importAccountButton] = buttons;
  }, 60000);

  it('has three buttons', () => {
    expect(buttons.length).toBe(3);
  }, 60000);

  it('has a "Log In" button that redirects to the Login view when clicked', async () => {
    expect(logInButton.textContent).toBe('Log in');
    click(logInButton);
    await whenOnNavigatedToRoute(store, LOGIN_ROUTE);
  }, 60000);

  it('has a "New Account" button that redirects to the Sign Up view when clicked', async () => {
    expect(newAccountButton.textContent).toBe('New account');
    click(newAccountButton);
    await whenOnNavigatedToRoute(store, SIGNUP_ROUTE);
  }, 60000);

  it('has an "Import Account" button that redirects to the Restore Account view when clicked', async () => {
    expect(importAccountButton.textContent).toBe('Import account');
    click(importAccountButton);
    await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);
  }, 60000);
});
