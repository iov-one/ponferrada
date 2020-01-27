import TestUtils from "react-dom/test-utils";

import { click } from "../../utils/test/dom";
import { travelToWelcome, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { CREATE_WALLET_ROUTE, POLICY_URL, RESTORE_WALLET, UNLOCK_ROUTE } from "../paths";

describe("DOM > Feature > Welcome", () => {
  let welcomeDom: React.Component;
  let buttons: Element[];
  let unlockButton: Element;
  let newWalletButton: Element;
  let importAccountButton: Element;

  beforeEach(async () => {
    welcomeDom = await travelToWelcome(true);
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(welcomeDom, "button");
    [unlockButton, newWalletButton, importAccountButton] = buttons;
  }, 60000);

  it("has three buttons", () => {
    expect(buttons.length).toBe(3);
  }, 60000);

  it("should contain two buttons in case if no persona exists", async () => {
    const welcomeDom = await travelToWelcome(false);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(welcomeDom, "button");
    expect(buttons.length).toBe(2);
  }, 60000);

  it('has a "Unlock" button that redirects to the Unlock view when clicked', async () => {
    expect(unlockButton.textContent).toBe("Unlock");
    click(unlockButton);
    await whenOnNavigatedToRoute(UNLOCK_ROUTE);
  }, 60000);

  it('has a "Create Wallet" button that redirects to the Sign Up view when clicked', async () => {
    expect(newWalletButton.textContent).toBe("Create Wallet");
    click(newWalletButton);
    await whenOnNavigatedToRoute(CREATE_WALLET_ROUTE);
  }, 60000);

  it('has an "Import Wallet" button that redirects to the Restore Wallet view when clicked', async () => {
    expect(importAccountButton.textContent).toBe("Import Wallet");
    click(importAccountButton);
    await whenOnNavigatedToRoute(RESTORE_WALLET);
  }, 60000);

  it("has a link to privacy policy", async () => {
    const policyLink = TestUtils.findRenderedDOMComponentWithTag(welcomeDom, "a");
    expect(policyLink.getAttribute("href")).toBe(POLICY_URL);
  }, 60000);
});
