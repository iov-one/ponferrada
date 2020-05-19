import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { extensionRpcEndpoint } from "../../communication/extensionRpcEndpoint";
import {
  closeBrowser,
  closeToast,
  createExtensionPage,
  createPage,
  getBackgroundPage,
  getToastMessage,
  launchBrowser,
} from "../../utils/test/e2e";
import { whenOnNavigatedToE2eRoute } from "../../utils/test/navigation";
import {
  acceptEnqueuedRequest,
  rejectEnqueuedRequest,
  submitExtensionCreateWalletForm,
} from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { UPGRADE_ROUTE } from "../paths";

withChainsDescribe("E2E > Login route", () => {
  let browser: Browser;
  let page: Page;
  let extensionPage: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../build")));

    app.get("/*", function(req: Request, res: Response) {
      res.sendFile(require("path").join(__dirname, "build", "index.html"));
    });

    server = app.listen(9000);
  });

  afterAll(() => {
    server.close();
  });

  withChainsDescribe("E2E > Login route", () => {
    beforeEach(async () => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
    }, 60000);

    afterEach(async () => {
      await closeBrowser(browser);
    });

    async function checkLoginMessage(page: Page): Promise<void> {
      const toastTextElement = await page.$("h6");
      if (!toastTextElement) throw new Error("h6 element not found");
      const text = await (await toastTextElement.getProperty("textContent")).jsonValue();
      expect(text).toBe(extensionRpcEndpoint.noMatchingIdentityMessage);

      await closeToast(page);
    }

    it("should redirect when enqueued login request is accepted", async () => {
      await getBackgroundPage(browser);
      await submitExtensionCreateWalletForm(extensionPage, "12345678");
      await page.bringToFront();
      // Click on login button
      await page.click("button");
      await sleep(1000);
      await acceptEnqueuedRequest(browser);
      await page.bringToFront();
      await whenOnNavigatedToE2eRoute(page, UPGRADE_ROUTE);
    }, 60000);

    it("should stay in login view if enqueued login request is rejected", async () => {
      await getBackgroundPage(browser);
      await submitExtensionCreateWalletForm(extensionPage, "12345678");
      await page.bringToFront();
      // Click on login button
      await page.click("button");
      await sleep(1000);
      await rejectEnqueuedRequest(browser);
      await page.bringToFront();
      await checkLoginMessage(page);
    }, 60000);

    it("shows login to Neuma extension if not persona detected", async () => {
      await getBackgroundPage(browser);
      await page.bringToFront();
      await sleep(1000);

      await page.click("button");
      await sleep(500);

      await checkLoginMessage(page);
    }, 60000);
  });

  it("shows install Neuma extension message", async () => {
    browser = await launchBrowser(0, false);
    page = await createPage(browser);
    await page.bringToFront();

    await sleep(1000);

    await page.click("button");
    await sleep(500);

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe(extensionRpcEndpoint.notAvailableMessage);
    await closeToast(page);

    await closeBrowser(browser);
  }, 60000);
});
