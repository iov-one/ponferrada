import TestUtils from "react-dom/test-utils";
import { randomString } from "ui-logic";

import {
  mockClearDatabase,
  mockClearPersona,
  mockClearPersonaWithException,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import { click, input, submit } from "../../utils/test/dom";
import { travelToDeleteWallet, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import { getMnemonicValidity, isButtonDisabled } from "./test/operateDeleteWallet";

describe("DOM > Feature > Delete Wallet", () => {
  let deleteWalletDom: React.Component;
  let buttons: Element[];
  let backButton: Element;
  let deleteButton: Element;
  let mnemonicInput: Element;
  let form: Element;
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
  const personaMock = mockPersonaResponse([], mnemonic, []);
  mockClearDatabase();

  beforeEach(async () => {
    deleteWalletDom = await travelToDeleteWallet(personaMock);
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(deleteWalletDom, "button");
    [backButton, deleteButton] = buttons;
    mnemonicInput = TestUtils.findRenderedDOMComponentWithTag(deleteWalletDom, "textarea");
    form = TestUtils.findRenderedDOMComponentWithTag(deleteWalletDom, "form");
  }, 60000);

  it("has two buttons", () => {
    expect(buttons.length).toBe(2);
  }, 60000);

  it("has a back arrow button that redirects to the Wallet Status view when clicked", async () => {
    expect(backButton.getAttribute("aria-label")).toBe("Go back");
    click(backButton);
    await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
  }, 60000);

  it('has a valid "Recovery phrase" input', () => {
    expect(mnemonicInput.getAttribute("placeholder")).toBe("Recovery phrase");

    submit(form);
    expect(getMnemonicValidity(deleteWalletDom).textContent).toBe("Required");

    input(mnemonicInput, randomString(10));
    submit(form);
    expect(getMnemonicValidity(deleteWalletDom).textContent).toBe(
      "Wrong mnemonic entered, please try another.",
    );

    input(mnemonicInput, mnemonic);
    expect(getMnemonicValidity(deleteWalletDom)).toBeUndefined();
  }, 60000);

  it('has a valid "Delete" button that redirects to the Wallet Status view if deleted successfuly when clicked', async () => {
    mockClearPersona();
    expect(deleteButton.textContent).toBe("Delete");
    expect(isButtonDisabled(deleteButton)).toBeTruthy();

    input(mnemonicInput, randomString(10));
    expect(isButtonDisabled(deleteButton)).toBeTruthy();

    input(mnemonicInput, mnemonic);
    await submit(mnemonicInput);
    await whenOnNavigatedToRoute(WELCOME_ROUTE);
  }, 60000);

  it('shows "An error has occurred during deleting wallet" toast message if wallet deletion unsuccessful', async () => {
    mockClearPersonaWithException();
    input(mnemonicInput, mnemonic);
    await submit(form);
    const toast = (await findRenderedDOMComponentWithId(deleteWalletDom, "toast-provider")) as Element;
    expect(toast.textContent).toBe("An error has occurred during deleting wallet");
  }, 60000);
});
