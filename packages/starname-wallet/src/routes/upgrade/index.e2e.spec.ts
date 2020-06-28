import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest } from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { registerIovnameWithoutStarname, waitForAllBalances } from "../balance/test/operateBalances";
import { travelToIovnamesTabE2E } from "./../iovnames/test/operateIovnames";
import { travelToUpgradeE2E } from "./test/travelToUpgrade";

withChainsDescribe("E2E > Upgrade route", () => {
  let browser: Browser;
  let page: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../build")));

    app.get("/*", function(req: Request, res: Response) {
      res.sendFile(require("path").join(__dirname, "build", "index.html"));
    });

    server = app.listen(9000);
  });

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("should travel to upgrade page to register iovname", async () => {
    await travelToUpgradeE2E(browser, page);
    const title = await page.$x(`//h5[contains(., 'Please register an iovname ')]`);
    expect(title.length).toBe(1);

    const [submitButton] = await page.$x(`//button[contains(., 'Register Now')]`);
    await submitButton.click();

    const addressesLink3 = await page.waitForSelector(`#Balances`);
    await addressesLink3.click();

    await waitForAllBalances(page);

    await travelToIovnamesTabE2E(page);

    await registerIovnameWithoutStarname(browser, page);

    await travelToIovnamesTabE2E(page);

    const addressesLink = await page.waitForSelector(`#Upgrade`);
    await addressesLink.click();
    await sleep(1000);
    const [submitButton2] = await page.$x(`//button[contains(., 'Upgrade Now')]`);
    await submitButton2.click();

    await acceptEnqueuedRequest(browser);
    await page.bringToFront();
    await sleep(1000);

    const title2 = await page.$x(`//h5[contains(., 'Your account has been successfully')]`);
    expect(title2.length).toBe(1);
  }, 65000);
});
