import TestUtils from "react-dom/test-utils";

import { click } from "../../utils/test/dom";
import { travelToWelcome, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { RESTORE_WALLET, SIGNUP_ROUTE, UNLOCK_ROUTE } from "../paths";

describe("DOM > Feature > Welcome", () => {
  let welcomeDom: React.Component;
  let buttons: Element[];
  let unlockButton: Element;
  let newWalletButton: Element;
  let importAccountButton: Element;

  beforeEach(async () => {
    welcomeDom = await travelToWelcome();
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(welcomeDom, "button");
    [unlockButton, newWalletButton, importAccountButton] = buttons;
  }, 60000);

  it("has three buttons", () => {
    expect(buttons.length).toBe(3);
  }, 60000);

  it('has a "Unlock" button that redirects to the Unlock view when clicked', async () => {
    expect(unlockButton.textContent).toBe("Unlock");
    click(unlockButton);
    await whenOnNavigatedToRoute(UNLOCK_ROUTE);
  }, 60000);

  it('has a "Create Wallet" button that redirects to the Sign Up view when clicked', async () => {
    expect(newWalletButton.textContent).toBe("Create Wallet");
    click(newWalletButton);
    await whenOnNavigatedToRoute(SIGNUP_ROUTE);
  }, 60000);

  it('has an "Import Wallet" button that redirects to the Restore Wallet view when clicked', async () => {
    expect(importAccountButton.textContent).toBe("Import Wallet");
    click(importAccountButton);
    await whenOnNavigatedToRoute(RESTORE_WALLET);
  }, 60000);
});
