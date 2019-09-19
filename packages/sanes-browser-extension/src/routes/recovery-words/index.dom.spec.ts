import TestUtils from "react-dom/test-utils";

import {
  mockGetPersonaData,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import { click } from "../../utils/test/dom";
import { travelToRecoveryWords, travelToWallet, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { RECOVERY_WORDS_ROUTE, WALLET_STATUS_ROUTE } from "../paths";
import * as Drawer from "../wallet/test/drawer";
import { getRenderedMnemonic } from "./test/operateRecoveryWords";

withChainsDescribe("DOM > Feature > Recovery Words", () => {
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
  const personaMock = mockPersonaResponse([], mnemonic, []);

  let recoveryWordsDom: React.Component;
  let backButton: Element;
  let exportButton: Element;

  beforeEach(async () => {
    recoveryWordsDom = await travelToRecoveryWords();
    [backButton, exportButton] = TestUtils.scryRenderedDOMComponentsWithTag(recoveryWordsDom, "button");
  }, 60000);

  it("has a back button that redirects to the previous route when clicked", async () => {
    await travelToWallet();
    await travelToRecoveryWords();
    expect(backButton.getAttribute("aria-label")).toBe("Go back");
    click(backButton);
    await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
  }, 60000);

  it('has an "Export as .PDF" button', () => {
    expect(exportButton.textContent).toBe("Export as .PDF");
    // TODO test downloads pdf
  }, 60000);

  it("shows an empty mnemonic if there is no current Persona", () => {
    expect(getRenderedMnemonic(recoveryWordsDom).textContent).toBe("");
  }, 60000);

  it("shows the mnemonic for the current Persona", async () => {
    recoveryWordsDom = await travelToRecoveryWords(personaMock);
    expect(getRenderedMnemonic(recoveryWordsDom).textContent).toBe(mnemonic);
  }, 60000);

  it("shows the mnemonic for the current Persona when accessed through Drawer menu", async () => {
    const accountDom = await travelToWallet(personaMock);

    mockGetPersonaData(personaMock);
    await Drawer.clickRecoveryWords(accountDom);
    await whenOnNavigatedToRoute(RECOVERY_WORDS_ROUTE);

    const recoveryWordsDom = accountDom;
    expect(getRenderedMnemonic(recoveryWordsDom).textContent).toBe(mnemonic);
  }, 60000);
});
