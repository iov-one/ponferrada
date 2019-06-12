import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import {
  mockCreatePersona,
  mockPersonaResponse,
} from '../../extension/background/model/persona/test/persona';
import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { click, input, submit } from '../../utils/test/dom';
import { travelToLogin, travelToRestoreAccount, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { randomString } from '../../utils/test/random';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE, LOGIN_ROUTE, RESTORE_ACCOUNT } from '../paths';
import { SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE } from './components/SetPasswordForm';
import {
  getConfirmPasswordValidity,
  getMnemonicForm,
  getMnemonicTextarea,
  getMnemonicValidity,
  getPasswordForm,
  getPasswordInputs,
  getPasswordValidity,
  isButtonDisabled,
  submitMnemonicForm,
} from './test/operateRestoreAccount';

withChainsDescribe('DOM > Feature > Restore Account', () => {
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
  const password = randomString(10);
  const personaMock = mockPersonaResponse([], mnemonic, []);

  let store: Store<RootState>;
  let restoreAccountDom: React.Component;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    restoreAccountDom = await travelToRestoreAccount(store);
  });

  describe('Set Mnemonic Step', () => {
    let mnemonicTextarea: Element;
    let mnemonicForm: Element;
    let buttons: Element[];
    let backButton: Element;
    let continueButton: Element;

    beforeEach(async () => {
      mnemonicTextarea = getMnemonicTextarea(restoreAccountDom);
      mnemonicForm = getMnemonicForm(restoreAccountDom);
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'button');
      [backButton, continueButton] = buttons;
    });

    it('has a valid "Recovery phrase" textarea', () => {
      expect(mnemonicTextarea.getAttribute('placeholder')).toBe('Recovery phrase');

      submit(mnemonicForm);
      expect(getMnemonicValidity(restoreAccountDom).textContent).toBe('Required');

      input(mnemonicTextarea, randomString(10));
      expect(getMnemonicValidity(restoreAccountDom).textContent).toBe('Should contain 12 words only');

      input(mnemonicTextarea, '1 2 3 4 5 6 7 8 9 10 11');
      expect(getMnemonicValidity(restoreAccountDom).textContent).toBe('Should contain 12 words only');

      input(mnemonicTextarea, '1 2 3 4 5 6 7 8 9 10 11 12 13');
      expect(getMnemonicValidity(restoreAccountDom).textContent).toBe('Should contain 12 words only');

      input(mnemonicTextarea, '1 2 3 4 5 6 7 8 9 10 11 12');
      expect(getMnemonicValidity(restoreAccountDom)).toBeUndefined();
    }, 10000);

    it('has two buttons', () => {
      expect(buttons.length).toBe(2);
    }, 10000);

    it('has a "Back" button that redirects to the previous route when clicked', async () => {
      expect(backButton.textContent).toBe('Back');

      await travelToLogin(store);
      await travelToRestoreAccount(store);
      click(backButton);
      await whenOnNavigatedToRoute(store, LOGIN_ROUTE);
    }, 10000);

    it('has a valid "Continue" button that redirects to the Set Password Form if the form is valid when clicked', async () => {
      expect(continueButton.textContent).toBe('Continue');

      expect(isButtonDisabled(continueButton)).toBeTruthy();

      input(mnemonicTextarea, mnemonic);
      expect(isButtonDisabled(continueButton)).toBeFalsy();
      await submit(continueButton);
      await findRenderedDOMComponentWithId(restoreAccountDom, SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE);
    }, 10000);
  });

  describe('Set Password Step', () => {
    let inputs: Element[];
    let passwordInput: Element;
    let passwordConfirmInput: Element;
    let passwordForm: Element;
    let buttons: Element[];
    let backButton: Element;
    let restoreButton: Element;

    beforeEach(async () => {
      await submitMnemonicForm(restoreAccountDom, mnemonic, password);
      inputs = getPasswordInputs(restoreAccountDom);
      [passwordInput, passwordConfirmInput] = inputs;
      passwordForm = getPasswordForm(restoreAccountDom);
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'button');
      [backButton, restoreButton] = buttons;
    }, 10000);

    it('has two inputs', () => {
      expect(inputs.length).toBe(2);
    }, 10000);

    it('has a valid "Password" input', () => {
      expect(passwordInput.getAttribute('placeholder')).toBe('Password');

      input(passwordConfirmInput, password);

      submit(passwordForm);
      expect(getPasswordValidity(restoreAccountDom).textContent).toBe('Required');

      input(passwordInput, randomString(7));
      expect(getPasswordValidity(restoreAccountDom).textContent).toBe('Must be longer than 8 characters');

      input(passwordInput, password);
      expect(getPasswordValidity(restoreAccountDom)).toBeUndefined();
    }, 10000);

    it('has a valid "Confirm Password" input', () => {
      expect(passwordConfirmInput.getAttribute('placeholder')).toBe('Confirm Password');

      input(passwordInput, password);

      submit(passwordForm);
      expect(getConfirmPasswordValidity(restoreAccountDom).textContent).toBe('Required');

      input(passwordConfirmInput, randomString(10));
      expect(getConfirmPasswordValidity(restoreAccountDom).textContent).toBe('Passwords mismatch');

      input(passwordConfirmInput, password);
      expect(getConfirmPasswordValidity(restoreAccountDom)).toBeUndefined();
    }, 10000);

    it('has two buttons', () => {
      expect(buttons.length).toBe(2);
    }, 10000);

    it('has a "Back" button that redirects to the Set Mnemonic Step when clicked', async () => {
      expect(backButton.textContent).toBe('Back');

      click(backButton);
      await findRenderedDOMComponentWithId(restoreAccountDom, RESTORE_ACCOUNT);
    }, 10000);

    it('has a valid "Restore" button that redirects to Account Status view if the form is valid when clicked', async () => {
      expect(restoreButton.textContent).toBe('Restore');

      expect(isButtonDisabled(restoreButton)).toBeTruthy();

      input(passwordInput, password);
      input(passwordConfirmInput, password);
      expect(isButtonDisabled(restoreButton)).toBeFalsy();
      mockCreatePersona(personaMock);
      await submit(restoreButton);
      await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
    }, 10000);

    it('accepts several UTF-8 alphabets as password fields', async () => {
      const password = 'abcαβγазб文字漢字한국';
      input(passwordInput, password);
      input(passwordConfirmInput, password);
      mockCreatePersona(personaMock);
      submit(passwordForm);
      await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
    }, 10000);
  });
});
