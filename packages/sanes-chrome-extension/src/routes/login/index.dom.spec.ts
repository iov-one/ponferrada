import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { click, input, submit } from '../../utils/test/dom';
import { travelToLogin, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { mockCreatePersona, mockPersonaResponse, submitSignup } from '../../utils/test/persona';
import { randomString } from '../../utils/test/random';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { ACCOUNT_STATUS_ROUTE, RESTORE_ACCOUNT, WELCOME_ROUTE } from '../paths';
import { getPasswordValidity, isButtonDisabled } from './test/operateLogin';

describe('DOM > Feature > Login', () => {
  let store: Store<RootState>;
  let loginDom: React.Component;
  let buttons: Element[];
  let backButton: Element;
  let continueButton: Element;
  let passwordInput: Element;
  let form: Element;
  let restoreAccountLink: Element;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    loginDom = await travelToLogin(store);
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'button');
    [backButton, continueButton] = buttons;
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'input');
    form = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'form');
    restoreAccountLink = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'a');
  }, 60000);

  it('has two buttons', () => {
    expect(buttons.length).toBe(2);
  }, 60000);

  it('has a back arrow button that redirects to the Welcome view when clicked', async () => {
    expect(backButton.getAttribute('aria-label')).toBe('Go back');
    click(backButton);
    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 60000);

  it('has a valid "Password" input', () => {
    expect(passwordInput.getAttribute('placeholder')).toBe('Password');

    submit(form);
    expect(getPasswordValidity(loginDom).textContent).toBe('Required');

    input(passwordInput, randomString(10));
    expect(getPasswordValidity(loginDom)).toBeUndefined();
  }, 60000);

  it('has a valid "Continue" button that redirects to the Account Status view if login successful when clicked', async () => {
    const password = randomString(10);
    const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
    const personaMock = mockPersonaResponse([], mnemonic, []);

    mockCreatePersona(personaMock);
    await submitSignup(store, undefined, password);
    loginDom = await travelToLogin(store);

    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'button')[1];
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'input');

    expect(continueButton.textContent).toBe('Continue');
    expect(isButtonDisabled(continueButton)).toBeTruthy();

    input(passwordInput, password);
    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'button')[1];
    expect(isButtonDisabled(continueButton)).toBeFalsy();
    click(continueButton);
    //TODO does not redirect to Account Status View
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
  }, 60000);

  it('shows "Error during login" toast message if login unsuccessful', async () => {
    input(passwordInput, randomString(10));
    submit(form);
    const toast = (await findRenderedDOMComponentWithId(loginDom, 'toast-provider')) as Element;
    expect(toast.textContent).toBe('Error during login');
  }, 60000);

  it('has a "Restore account" link that redirects to the Restore Account view when clicked', async () => {
    expect(restoreAccountLink.textContent).toBe('Restore account');
    click(restoreAccountLink);
    await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);
  }, 60000);
});
