import { Address, ChainId } from "@iov/bcp";
import TestUtils from "react-dom/test-utils";
import { randomString } from "ui-logic";

import { PersonaAcccount } from "../../extension/background/model/persona";
import {
  mockCreatePersona,
  mockPersonaResponse,
  processCreateWallet,
} from "../../extension/background/model/persona/test/persona";
import { check, click, input, submit } from "../../utils/test/dom";
import {
  travelTo,
  travelToCreateWallet,
  travelToWelcome,
  whenOnNavigatedToRoute,
} from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { mayTestChains } from "../../utils/test/testExecutor";
import { CREATE_WALLET_ROUTE, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import { CREATE_WALLET_ID_STEP_1 } from "./components/NewWalletForm";
import { CREATE_WALLET_ID_STEP_3 } from "./components/SecurityHintForm";
import { CREATE_WALLET_ID_STEP_2 } from "./components/ShowWordsForm";
import {
  checkHintValidity,
  getConfirmPasswordMismatch,
  getConfirmPasswordValidity,
  getNewWalletForm,
  getNewWalletInputs,
  getPasswordValidity,
  getTermsCheckboxLabel,
  getTermsValidity,
  isButtonDisabled,
  submitNewWallet,
  submitShowWords,
} from "./test/operateCreateWallet";

describe("DOM > Feature > CreateWallet", () => {
  const password = randomString(10);
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
  const connectedChains = [
    "local-iov-devnet" as ChainId,
    "lisk-198f2b61a8" as ChainId,
    "ethereum-eip155-5777" as ChainId,
  ];
  const hint = randomString(10);
  const account: PersonaAcccount = {
    iovAddress: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
    label: "Account 0",
  };
  const personaMock = mockPersonaResponse(mnemonic, connectedChains, [account], [], []);

  let createWalletDom: React.Component;

  beforeEach(async () => {
    // createWalletDom = await travelToCreateWallet();
    createWalletDom = await travelTo(CREATE_WALLET_ROUTE, [], personaMock);
  }, 10000);

  mayTestChains(
    "should finish the create wallet three steps process",
    async () => {
      mockCreatePersona(personaMock);
      await processCreateWallet();
    },
    60000,
  );

  describe("New Wallet Step", () => {
    let newWalletInputs: Element[];
    let passwordInput: Element;
    let passwordConfirmInput: Element;
    let termsAcceptField: Element;
    let newAccountForm: Element;
    let buttons: Element[];
    let backButton: Element;
    let continueButton: Element;

    beforeEach(async () => {
      newWalletInputs = getNewWalletInputs(createWalletDom);
      [passwordInput, passwordConfirmInput, termsAcceptField] = newWalletInputs;
      newAccountForm = getNewWalletForm(createWalletDom);
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(createWalletDom, "button");
      [backButton, continueButton] = buttons;
    });

    it("has three inputs", () => {
      expect(newWalletInputs.length).toBe(3);
    }, 10000);

    it('has a valid "Password" input', async () => {
      expect(passwordInput.getAttribute("placeholder")).toBe("Password");

      input(passwordConfirmInput, password);
      await check(termsAcceptField);

      await submit(newAccountForm);
      expect(getPasswordValidity(createWalletDom).textContent).toBe("Required");

      input(passwordInput, randomString(7));
      expect(getPasswordValidity(createWalletDom).textContent).toBe(
        "Password should have at least 8 characters",
      );

      input(passwordInput, password);
      expect(getPasswordValidity(createWalletDom)).toBeUndefined();
    }, 10000);

    it('has a valid "Confirm Password" input', async () => {
      expect(passwordConfirmInput.getAttribute("placeholder")).toBe("Confirm Password");

      await check(termsAcceptField);

      await submit(newAccountForm);
      expect(getConfirmPasswordValidity(createWalletDom).textContent).toBe("Required");

      input(passwordInput, password);

      input(passwordConfirmInput, randomString(10));
      expect(getConfirmPasswordMismatch(createWalletDom).textContent).toBe("Passwords mismatch");

      input(passwordConfirmInput, password);
      expect(getConfirmPasswordValidity(createWalletDom)).toBeUndefined();
    }, 10000);

    it('has a valid "Terms agreement" checkbox', async () => {
      expect(getTermsCheckboxLabel(termsAcceptField)).toBe("I have read and agree the T&C");

      input(passwordInput, password);
      input(passwordConfirmInput, password);

      await submit(newAccountForm);

      expect(getTermsValidity(createWalletDom).textContent).toBe(
        "You should accept T&C in order to continue",
      );

      await check(termsAcceptField);
      expect(getConfirmPasswordValidity(createWalletDom)).toBeUndefined();
    }, 10000);

    it("has two buttons", () => {
      expect(buttons.length).toBe(2);
    }, 10000);

    it('has a "Back" button that redirects to the previous route when clicked', async () => {
      expect(backButton.textContent).toBe("Back");
      await travelToWelcome(true);
      await travelToCreateWallet();
      click(backButton);
      await whenOnNavigatedToRoute(WELCOME_ROUTE);
    }, 10000);

    it('has a valid "Continue" button that redirects to the Show Words Form if the form is valid when clicked', async () => {
      expect(continueButton.textContent).toBe("Continue");
      expect(isButtonDisabled(continueButton)).toBeTruthy();

      input(passwordInput, password);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);

      expect(isButtonDisabled(continueButton)).toBeFalsy();
      mockCreatePersona(personaMock);

      await submit(newAccountForm);
      await findRenderedDOMComponentWithId(createWalletDom, CREATE_WALLET_ID_STEP_2);
    }, 10000);

    it("accepts several UTF-8 alphabets as password fields", async () => {
      const password = "abcαβγазб文字漢字한국";
      input(passwordInput, password);
      input(passwordConfirmInput, password);
      await check(termsAcceptField);
      mockCreatePersona(personaMock);
      await submit(newAccountForm);
      await findRenderedDOMComponentWithId(createWalletDom, CREATE_WALLET_ID_STEP_2);
    }, 10000);
  });

  describe("Show Words Step", () => {
    let checkbox: Element;
    let buttons: Element[];
    let backButton: Element;
    let continueButton: Element;

    beforeEach(async () => {
      mockCreatePersona(mockPersonaResponse(mnemonic, [], [], []));
      await submitNewWallet(createWalletDom, password);

      checkbox = TestUtils.findRenderedDOMComponentWithTag(createWalletDom, "input");
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(createWalletDom, "button");
      [backButton, continueButton] = buttons;
    });

    it("has an explanation text", async () => {
      const explanation = TestUtils.scryRenderedDOMComponentsWithTag(createWalletDom, "p")[0];
      expect(explanation.textContent || "").toMatch(/^Your secret recovery words/);
    });

    it("has a toggle button that shows the mnemonic when active", async () => {
      const renderedMnemonic = TestUtils.scryRenderedDOMComponentsWithTag(createWalletDom, "p")[1];
      expect(renderedMnemonic.textContent).toBe("");

      await check(checkbox);

      expect(renderedMnemonic.textContent).toBe(mnemonic);
    }, 10000);

    it('has a "Back" button that redirects to the previous view when clicked', async () => {
      expect(backButton.textContent).toBe("Back");

      await click(backButton);
      await findRenderedDOMComponentWithId(createWalletDom, CREATE_WALLET_ID_STEP_1);
    }, 10000);

    it('has a "Continue" button that redirects to the Security Hint Form when clicked', async () => {
      expect(continueButton.textContent).toBe("Continue");

      click(continueButton);
      await findRenderedDOMComponentWithId(createWalletDom, CREATE_WALLET_ID_STEP_3);
    }, 10000);
  });

  describe("Security Hint Step", () => {
    let hintInput: Element;
    let buttons: Element[];
    let backButton: Element;
    let createButton: Element;

    beforeEach(async () => {
      mockCreatePersona(mockPersonaResponse(mnemonic, [], [], []));
      await submitNewWallet(createWalletDom, password);
      await submitShowWords(createWalletDom);

      hintInput = TestUtils.findRenderedDOMComponentWithTag(createWalletDom, "input");
      buttons = TestUtils.scryRenderedDOMComponentsWithTag(createWalletDom, "button");
      [backButton, createButton] = buttons;
    });

    it('has a valid "Security hint" input', async () => {
      expect(hintInput.getAttribute("placeholder")).toBe("Security hint");

      input(hintInput, randomString(16));
      checkHintValidity(createWalletDom, "15 characters max - Spaces are allowed");

      input(hintInput, hint);
      checkHintValidity(createWalletDom, undefined);
    }, 10000);

    it('has a "Back" button that redirects to the New Account Form when clicked', async () => {
      expect(backButton.textContent).toBe("Back");

      await click(backButton);
      await findRenderedDOMComponentWithId(createWalletDom, CREATE_WALLET_ID_STEP_2);
    }, 10000);

    it('has a valid "Create" button that redirects to the Account Status view when clicked', async () => {
      expect(createButton.textContent).toBe("Create");
      expect(isButtonDisabled(createButton)).toBeFalsy();

      input(hintInput, randomString(16));
      expect(isButtonDisabled(createButton)).toBeTruthy();

      input(hintInput, hint);
      expect(isButtonDisabled(createButton)).toBeFalsy();

      await submit(createButton);
      await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
    }, 10000);
  });
});
