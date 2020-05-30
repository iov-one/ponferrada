import clipboardy from "clipboardy";
import { Browser, Page } from "puppeteer";
import { randomString, sleep } from "ui-logic";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import {
  submitRecoveryWordsE2E,
  travelToRestoreWalletStep,
} from "../restore-wallet/test/operateRestoreWallet";
import { addressId } from "./index";
import { getBalanceAmount } from "./test/operateWallet";

withChainsDescribe("E2E > Wallet route", () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);

    await travelToRestoreWalletStep(page);
    const password = randomString(10);
    const mnemonic = "degree tackle suggest window test behind mesh extra cover prepare oak script";
    await submitRecoveryWordsE2E(page, mnemonic, password);
  }, 15000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  it("can copy address to clipboard", async () => {
    await sleep(500);

    await page.hover(`#${addressId}`);
    await sleep(500);

    const [addressesCopy] = await page.$x(`//span[contains(., 'Copy to clipboard')]`);
    await addressesCopy.click();
    expect(clipboardy.readSync()).toBe("tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea");
  }, 20000);

  it("can get balance amount", async () => {
    const balanceAmount = await getBalanceAmount(page);
    expect(balanceAmount).toBe("123,456,778.84 CASH");
  }, 20000);
});
