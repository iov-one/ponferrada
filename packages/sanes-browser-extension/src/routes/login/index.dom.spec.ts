import TestUtils from "react-dom/test-utils";
import { randomString } from "ui-logic";

import {
  mockCreatePersona,
  mockLoadPersona,
  mockPersonaResponse,
  processSignup,
} from "../../extension/background/model/persona/test/persona";
import { click, input, submit } from "../../utils/test/dom";
import { travelToLogin, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { RESTORE_WALLET, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import { getPasswordValidity, isButtonDisabled } from "./test/operateLogin";

describe("DOM > Feature > Login", () => {
  let loginDom: React.Component;
  let buttons: Element[];
  let backButton: Element;
  let continueButton: Element;
  let passwordInput: Element;
  let form: Element;
  let restoreAccountLink: Element;

  beforeEach(async () => {
    loginDom = await travelToLogin();
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, "button");
    [backButton, continueButton] = buttons;
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(loginDom, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(loginDom, "form");
    restoreAccountLink = TestUtils.findRenderedDOMComponentWithTag(loginDom, "a");
  }, 60000);

  it("has two buttons", () => {
    expect(buttons.length).toBe(2);
  }, 60000);

  it("has a back arrow button that redirects to the Welcome view when clicked", async () => {
    expect(backButton.getAttribute("aria-label")).toBe("Go back");
    click(backButton);
    await whenOnNavigatedToRoute(WELCOME_ROUTE);
  }, 60000);

  it('has a valid "Password" input', () => {
    expect(passwordInput.getAttribute("placeholder")).toBe("Password");

    submit(form);
    expect(getPasswordValidity(loginDom).textContent).toBe("Required");

    input(passwordInput, randomString(10));
    expect(getPasswordValidity(loginDom)).toBeUndefined();
  }, 60000);

  it('has a valid "Continue" button that redirects to the Account Status view if login successful when clicked', async () => {
    const password = randomString(10);
    const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
    const personaMock = mockPersonaResponse([], mnemonic, []);

    mockCreatePersona(personaMock);
    await processSignup(undefined, password);
    loginDom = await travelToLogin();

    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, "button")[1];
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(loginDom, "input");

    expect(continueButton.textContent).toBe("Continue");
    expect(isButtonDisabled(continueButton)).toBeTruthy();

    input(passwordInput, password);
    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, "button")[1];
    expect(isButtonDisabled(continueButton)).toBeFalsy();

    mockLoadPersona(personaMock);
    await submit(continueButton);
    await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
  }, 60000);

  it('shows "Error during login" toast message if login unsuccessful', async () => {
    input(passwordInput, randomString(10));
    submit(form);
    const toast = (await findRenderedDOMComponentWithId(loginDom, "toast-provider")) as Element;
    expect(toast.textContent).toBe("Error during login");
  }, 60000);

  it('has a "Restore wallet" link that redirects to the Restore Wallet view when clicked', async () => {
    expect(restoreAccountLink.textContent).toBe("Restore wallet");
    await click(restoreAccountLink);
    await whenOnNavigatedToRoute(RESTORE_WALLET);
  }, 60000);
});
