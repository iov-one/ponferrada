import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import {
  mockGetPersonaData,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import { aNewStore } from "../../store";
import { resetHistory, RootState } from "../../store/reducers";
import { click } from "../../utils/test/dom";
import { travelToAccount, travelToRecoveryPhrase, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import * as Drawer from "../account/test/drawer";
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE } from "../paths";
import { getRenderedMnemonic } from "./test/operateRecoveryPhrase";

withChainsDescribe("DOM > Feature > Recovery Phrase", () => {
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
  const personaMock = mockPersonaResponse([], mnemonic, []);

  let store: Store<RootState>;
  let recoveryPhraseDom: React.Component;
  let backButton: Element;
  let exportButton: Element;

  beforeEach(async () => {
    resetHistory();
    store = aNewStore();
    recoveryPhraseDom = await travelToRecoveryPhrase(store);
    [backButton, exportButton] = TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, "button");
  }, 60000);

  it("has a back button that redirects to the previous route when clicked", async () => {
    await travelToAccount(store);
    await travelToRecoveryPhrase(store);
    expect(backButton.getAttribute("aria-label")).toBe("Go back");
    click(backButton);
    await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
  }, 60000);

  it('has an "Export as .PDF" button', () => {
    expect(exportButton.textContent).toBe("Export as .PDF");
    //TODO test downloads pdf
  }, 60000);

  it("shows an empty mnemonic if there is no current Persona", () => {
    expect(getRenderedMnemonic(recoveryPhraseDom).textContent).toBe("");
  }, 60000);

  it("shows the mnemonic for the current Persona", async () => {
    recoveryPhraseDom = await travelToRecoveryPhrase(store, personaMock);
    expect(getRenderedMnemonic(recoveryPhraseDom).textContent).toBe(mnemonic);
  }, 60000);

  it("shows the mnemonic for the current Persona when accessed through Drawer menu", async () => {
    const accountDom = await travelToAccount(store, personaMock);

    mockGetPersonaData(personaMock);
    await Drawer.clickRecoveryPhrase(accountDom);
    await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);

    const recoveryPhraseDom = accountDom;
    expect(getRenderedMnemonic(recoveryPhraseDom).textContent).toBe(mnemonic);
  }, 60000);
});
