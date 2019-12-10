import { Browser, Page } from "puppeteer";
import { randomString } from "ui-logic";

import { IovWindowExtension } from "../../extension/background/model/backgroundscript";
import {
  closeBrowser,
  createPage,
  EXTENSION_ID,
  getBackgroundPage,
  launchBrowser,
} from "../../utils/test/e2e";
import { findRenderedE2EComponentWithId } from "../../utils/test/reactElemFinder";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import {
  submitNewWalletE2E,
  submitSecurityHintE2E,
  submitShowWordsE2E,
  travelToCreateWalletNewWalletStep,
} from "../create-wallet/test/operateCreateWallet";
import { UNLOCK_ROUTE, WALLET_STATUS_ROUTE } from "../paths";
import { submitE2EUnlockForm } from "./test/submitUnlockForm";

withChainsDescribe("DOM > Unlock route", (): void => {
  let browser: Browser;
  let page: Page;
  let bgPage: Page;

  beforeEach(async (): Promise<void> => {
    browser = await launchBrowser();
    page = await createPage(browser);
    bgPage = await getBackgroundPage(browser);
  }, 45000);

  afterEach(
    async (): Promise<void> => {
      await closeBrowser(browser);
    },
  );

  it("should redirect to unlock route after browser restart", async (): Promise<void> => {
    await travelToCreateWalletNewWalletStep(page);
    const password = randomString(10);
    await submitNewWalletE2E(page, randomString(10), password);
    await submitShowWordsE2E(page);
    await submitSecurityHintE2E(page, randomString(10));
    // Simulating reload
    await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`, {
      waitUntil: "networkidle2",
    });
    await findRenderedE2EComponentWithId(page, WALLET_STATUS_ROUTE);

    await bgPage.evaluate((): void => {
      ((window as Window) as IovWindowExtension).clearPersona();
    });

    // Simulating reload
    await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`, {
      waitUntil: "networkidle2",
    });
    await findRenderedE2EComponentWithId(page, UNLOCK_ROUTE);
    await submitE2EUnlockForm(page, password);
    await findRenderedE2EComponentWithId(page, WALLET_STATUS_ROUTE);
  }, 45000);
});
