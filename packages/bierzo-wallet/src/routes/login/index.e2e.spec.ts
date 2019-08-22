import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

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
  submitExtensionSignupForm,
} from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { BALANCE_ROUTE } from "../paths";
import { INSTALL_EXTENSION_MSG, LOGIN_EXTENSION_MSG } from ".";

withChainsDescribe("E2E > Login route", (): void => {
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

  withChainsDescribe("E2E > Login route", (): void => {
    beforeEach(async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
    }, 60000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    async function checkLoginMessage(page: Page): Promise<void> {
      const element = await page.$("h6");
      if (element === null) {
        throw new Error();
      }
      const text = await (await element.getProperty("textContent")).jsonValue();
      expect(text).toBe(LOGIN_EXTENSION_MSG);

      await closeToast(page);
    }

    it("should redirect when enqueued login request is accepted", async (): Promise<void> => {
      await getBackgroundPage(browser);
      await submitExtensionSignupForm(extensionPage, "username", "12345678");
      await page.bringToFront();
      //Click on login button
      await page.click("button");
      await sleep(1000);
      await acceptEnqueuedRequest(browser);
      await page.bringToFront();
      await whenOnNavigatedToE2eRoute(page, BALANCE_ROUTE);
    }, 60000);

    it("should stay in login view if enqueued login request is rejected", async (): Promise<void> => {
      await getBackgroundPage(browser);
      await submitExtensionSignupForm(extensionPage, "username", "12345678");
      await page.bringToFront();
      //Click on login button
      await page.click("button");
      await sleep(1000);
      await rejectEnqueuedRequest(browser);
      await page.bringToFront();
      await checkLoginMessage(page);
    }, 60000);

    it("shows login to IOV extension if not persona detected", async (): Promise<void> => {
      await getBackgroundPage(browser);
      await page.bringToFront();
      await sleep(1000);

      await page.click("button");
      await sleep(500);

      await checkLoginMessage(page);
    }, 60000);
  });

  it("shows install IOV extension message", async (): Promise<void> => {
    browser = await launchBrowser(0, false);
    page = await createPage(browser);
    await page.bringToFront();

    await sleep(1000);

    await page.click("button");
    await sleep(500);

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe(INSTALL_EXTENSION_MSG);
    await closeToast(page);

    await closeBrowser(browser);
  }, 60000);
});
