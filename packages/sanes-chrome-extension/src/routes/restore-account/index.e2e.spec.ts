import { Browser, Page } from "puppeteer";
import { randomString } from "ui-logic";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { submitRecoveryPhraseE2E, travelToRestoreAccountStep } from "./test/operateRestoreAccount";

withChainsDescribe("E2E > Restore Account route", () => {
  const password = randomString(10);
  const mnemonic = "degree tackle suggest window test behind mesh extra cover prepare oak script";

  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
  }, 45000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  it("should redirect to restore account route, fill recovery phrase and redirect to account route", async () => {
    await travelToRestoreAccountStep(page);
    await submitRecoveryPhraseE2E(page, mnemonic, password);
  }, 60000);
});
