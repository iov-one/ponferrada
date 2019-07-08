import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import {
  mockCreatePersona,
  mockPersonaResponse,
  processSignup,
} from '../../extension/background/model/persona/test/persona';
import { aNewStore } from '../../store';
import { resetHistory, RootState } from '../../store/reducers';
import { check, click, input, submit } from '../../utils/test/dom';
import { travelToSignup, travelToWelcome, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { randomString } from '../../utils/test/random';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { mayTestChains } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE, WELCOME_ROUTE } from '../paths';
import { FIRST_STEP_SIGNUP_ROUTE } from './components/NewAccountForm';
import { SECURITY_HINT_STEP_SIGNUP_ROUTE } from './components/SecurityHintForm';
import { SECOND_STEP_SIGNUP_ROUTE } from './components/ShowPhraseForm';
import {
  checkAccountNameValidity,
  checkHintValidity,
  getConfirmPasswordMismatch,
  getConfirmPasswordValidity,
  getNewAccountForm,
  getNewAccountInputs,
  getPasswordValidity,
  getTermsCheckboxLabel,
  getTermsValidity,
  isButtonDisabled,
  submitNewAccount,
  submitShowPhrase,
} from './test/operateSignup';

describe('DOM > Feature > Signup', () => {
  const accountName = randomString(10);
  const password = randomString(10);
  const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
  const hint = randomString(10);
  const personaMock = mockPersonaResponse([], mnemonic, []);

  let store: Store<RootState>;
  let signupDom: React.Component;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    signupDom = await travelToSignup(store);
  }, 10000);

  mayTestChains(
    'should finish the signup three steps process',
    async () => {
      mockCreatePersona(personaMock);
      await processSignup(store);
    },
    10000,
  );

  describe('New Account Step', () => {
    let newAccountInputs: Element[];
    let accountNameInput: Element;
    let passwordInput: Element;
    let passwordConfirmInput: Element;
    let termsAcceptField: Element;
    let newAccountForm: Element;
    let buttons: Element[];
    let backButton: Element;
    let continueButton: Element;

    beforeEach(async () => {
      newAccountInputs = getNewAccountInputs(signupDom);
      [accountNameInput, passwordInput, passwordConfirmInput, termsAcceptField] = newAccountInputs;
      newAccountForm = getNewAccountForm(signupDom);
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'button');
      [backButton, continueButton] = buttons;
    });

    it('has four inputs', () => {
      expect(newAccountInputs.length).toBe(4);
    }, 10000);

    it('has a valid "Account Name" input', async () => {
      expect(accountNameInput.getAttribute('placeholder')).toBe('Account name');

      input(passwordInput, password);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);

      await submit(newAccountForm);
      checkAccountNameValidity(signupDom, 'Required');

      input(accountNameInput, randomString(7));
      checkAccountNameValidity(signupDom, 'Username should have at least 8 characters');

      input(accountNameInput, accountName);
      checkAccountNameValidity(signupDom);
    }, 10000);

    it('has a valid "Password" input', async () => {
      expect(passwordInput.getAttribute('placeholder')).toBe('Password');

      input(accountNameInput, accountName);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);

      await submit(newAccountForm);
      expect(getPasswordValidity(signupDom).textContent).toBe('Required');

      input(passwordInput, randomString(7));
      expect(getPasswordValidity(signupDom).textContent).toBe('Password should have at least 8 characters');

      input(passwordInput, password);
      expect(getPasswordValidity(signupDom)).toBeUndefined();
    }, 10000);

    it('has a valid "Confirm Password" input', async () => {
      expect(passwordConfirmInput.getAttribute('placeholder')).toBe('Confirm Password');

      input(accountNameInput, accountName);
      await check(termsAcceptField);

      await submit(newAccountForm);
      expect(getConfirmPasswordValidity(signupDom).textContent).toBe('Required');

      input(passwordInput, password);

      input(passwordConfirmInput, randomString(10));
      expect(getConfirmPasswordMismatch(signupDom).textContent).toBe('Passwords mismatch');

      input(passwordConfirmInput, password);
      expect(getConfirmPasswordValidity(signupDom)).toBeUndefined();
    }, 10000);

    it('has a valid "Terms agreement" checkbox', async () => {
      expect(getTermsCheckboxLabel(termsAcceptField)).toBe('I have read and agree the T&C');

      input(accountNameInput, accountName);
      input(passwordInput, password);
      input(passwordConfirmInput, password);

      await submit(newAccountForm);

      expect(getTermsValidity(signupDom).textContent).toBe('You should accept T&C in order to continue');

      await check(termsAcceptField);
      expect(getConfirmPasswordValidity(signupDom)).toBeUndefined();
    }, 10000);

    it('has two buttons', () => {
      expect(buttons.length).toBe(2);
    }, 10000);

    it('has a "Back" button that redirects to the previous route when clicked', async () => {
      expect(backButton.textContent).toBe('Back');

      await travelToWelcome(store);
      await travelToSignup(store);
      click(backButton);
      await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
    }, 10000);

    it('has a valid "Continue" button that redirects to the Show Phrase Form if the form is valid when clicked', async () => {
      expect(continueButton.textContent).toBe('Continue');
      expect(isButtonDisabled(continueButton)).toBeTruthy();

      input(accountNameInput, accountName);
      input(passwordInput, password);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);

      expect(isButtonDisabled(continueButton)).toBeFalsy();
      mockCreatePersona(personaMock);

      await submit(newAccountForm);
      await findRenderedDOMComponentWithId(signupDom, SECOND_STEP_SIGNUP_ROUTE);
    }, 10000);

    it('accepts several UTF-8 alphabets as password fields', async () => {
      const password = 'abcαβγазб文字漢字한국';
      input(accountNameInput, accountName);
      input(passwordInput, password);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);
      mockCreatePersona(personaMock);
      await submit(newAccountForm);
      await findRenderedDOMComponentWithId(signupDom, SECOND_STEP_SIGNUP_ROUTE);
    }, 10000);
  });

  describe('Show Phrase Step', () => {
    let questionMark: Element;
    let checkbox: Element;
    let buttons: Element[];
    let backButton: Element;
    let continueButton: Element;

    beforeEach(async () => {
      mockCreatePersona(mockPersonaResponse([], mnemonic, []));
      await submitNewAccount(signupDom, accountName, password);

      questionMark = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'img')[0];
      checkbox = TestUtils.findRenderedDOMComponentWithTag(signupDom, 'input');
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'button');
      [backButton, continueButton] = buttons;
    });

    it('has a question mark button that toggles a tooltip when clicked', async () => {
      let paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'p');
      expect(paragraphs.length).toBe(1);

      await click(questionMark);

      paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'p');
      expect(paragraphs.length).toBe(2);
    }, 10000);

    it('has a toggle button that shows the mnemonic when active', async () => {
      const renderedMnemonic = TestUtils.findRenderedDOMComponentWithTag(signupDom, 'p');
      expect(renderedMnemonic.textContent).toBe('');

      await check(checkbox);

      expect(renderedMnemonic.textContent).toBe(mnemonic);
    }, 10000);

    it('has a "Back" button that redirects to the previous view when clicked', async () => {
      expect(backButton.textContent).toBe('Back');

      await click(backButton);
      await findRenderedDOMComponentWithId(signupDom, FIRST_STEP_SIGNUP_ROUTE);
    }, 10000);

    it('has a "Continue" button that redirects to the Security Hint Form when clicked', async () => {
      expect(continueButton.textContent).toBe('Continue');

      click(continueButton);
      await findRenderedDOMComponentWithId(signupDom, SECURITY_HINT_STEP_SIGNUP_ROUTE);
    }, 10000);
  });

  describe('Security Hint Step', () => {
    let hintInput: Element;
    let buttons: Element[];
    let backButton: Element;
    let createButton: Element;

    beforeEach(async () => {
      mockCreatePersona(mockPersonaResponse([], mnemonic, []));
      await submitNewAccount(signupDom, accountName, password);
      await submitShowPhrase(signupDom);

      hintInput = TestUtils.findRenderedDOMComponentWithTag(signupDom, 'input');
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, 'button');
      [backButton, createButton] = buttons;
    });

    it('has a valid "Security hint" input', async () => {
      expect(hintInput.getAttribute('placeholder')).toBe('Security hint');

      input(hintInput, randomString(16));
      checkHintValidity(signupDom, '15 characters max - Spaces are allowed');

      input(hintInput, hint);
      checkHintValidity(signupDom, undefined);
    }, 10000);

    it('has a "Back" button that redirects to the New Account Form when clicked', async () => {
      expect(backButton.textContent).toBe('Back');

      await click(backButton);
      await findRenderedDOMComponentWithId(signupDom, SECOND_STEP_SIGNUP_ROUTE);
    }, 10000);

    it('has a valid "Create" button that redirects to the Account Status view when clicked', async () => {
      expect(createButton.textContent).toBe('Create');
      expect(isButtonDisabled(createButton)).toBeFalsy();

      input(hintInput, randomString(16));
      expect(isButtonDisabled(createButton)).toBeTruthy();

      input(hintInput, hint);
      expect(isButtonDisabled(createButton)).toBeFalsy();

      await submit(createButton);
      await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
    }, 10000);
  });
});
