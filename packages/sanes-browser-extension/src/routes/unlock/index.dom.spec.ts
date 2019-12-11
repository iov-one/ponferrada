import TestUtils from "react-dom/test-utils";
import { randomString } from "ui-logic";

import {
  mockCreatePersona,
  mockLoadPersona,
  mockPersonaResponse,
  processCreateWallet,
} from "../../extension/background/model/persona/test/persona";
import { click, input, submit } from "../../utils/test/dom";
import { travelToUnlock, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { RESTORE_WALLET, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import { getPasswordValidity, isButtonDisabled } from "./test/operateUnlock";

describe("DOM > Feature > Unlock", () => {
  let unlockDom: React.Component;
  let buttons: Element[];
  let backButton: Element;
  let continueButton: Element;
  let passwordInput: Element;
  let form: Element;
  let restoreAccountLink: Element;

  beforeEach(async () => {
    unlockDom = await travelToUnlock();
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(unlockDom, "button");
    [backButton, continueButton] = buttons;
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(unlockDom, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(unlockDom, "form");
    restoreAccountLink = TestUtils.findRenderedDOMComponentWithTag(unlockDom, "a");
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
    expect(getPasswordValidity(unlockDom).textContent).toBe("Required");

    input(passwordInput, randomString(10));
    expect(getPasswordValidity(unlockDom)).toBeUndefined();
  }, 60000);

  it('has a valid "Continue" button that redirects to the Account Status view if unlock successful when clicked', async () => {
    const password = randomString(10);
    const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
    const personaMock = mockPersonaResponse(mnemonic, [], [], []);

    mockCreatePersona(personaMock);
    await processCreateWallet(undefined, password);
    unlockDom = await travelToUnlock();

    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(unlockDom, "button")[1];
    passwordInput = TestUtils.findRenderedDOMComponentWithTag(unlockDom, "input");

    expect(continueButton.textContent).toBe("Continue");
    expect(isButtonDisabled(continueButton)).toBeTruthy();

    input(passwordInput, password);
    continueButton = TestUtils.scryRenderedDOMComponentsWithTag(unlockDom, "button")[1];
    expect(isButtonDisabled(continueButton)).toBeFalsy();

    mockLoadPersona(personaMock);
    await submit(continueButton);
    await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
  }, 60000);

  it('shows "Error during unlock" toast message if unlock unsuccessful', async () => {
    input(passwordInput, randomString(10));
    submit(form);
    const toast = (await findRenderedDOMComponentWithId(unlockDom, "toast-provider")) as Element;
    expect(toast.textContent).toBe("Error during unlock");
  }, 60000);

  it('has a "Restore wallet" link that redirects to the Restore Wallet view when clicked', async () => {
    expect(restoreAccountLink.textContent).toBe("Restore wallet");
    await click(restoreAccountLink);
    await whenOnNavigatedToRoute(RESTORE_WALLET);
  }, 60000);
});
