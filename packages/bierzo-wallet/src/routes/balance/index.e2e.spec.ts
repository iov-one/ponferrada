import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { randomString, sleep } from "ui-logic";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest } from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE } from "../paths";
import { REGISTER_USERNAME_FIELD } from "../registerName/components";
import {
  getBalanceTextAtIndex,
  getUsernameE2E,
  waitForAllBalances,
  waitForUsername,
} from "./test/operateBalances";
import { travelToBalanceE2E } from "./test/travelToBalance";

withChainsDescribe("E2E > Balance route", () => {
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
    await travelToBalanceE2E(browser, page);
  }, 30000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("should contain balances", async () => {
    await waitForAllBalances(page);

    const balances = [
      await getBalanceTextAtIndex(await page.$$("h6"), 0),
      await getBalanceTextAtIndex(await page.$$("h6"), 1),
      await getBalanceTextAtIndex(await page.$$("h6"), 2),
      await getBalanceTextAtIndex(await page.$$("h6"), 3),
    ];

    expect(balances).toEqual(["10 BASH", "10 CASH", "10 ETH", "5 LSK"]);
  }, 45000);

  it("should contain message to get address", async () => {
    const username = await getUsernameE2E(await page.$$("h5"));

    expect(username).toBe("Get your human readable");
  }, 45000);

  it("should create personalized address", async () => {
    await waitForAllBalances(page);
    await page.click(`#${REGISTER_PERSONALIZED_ADDRESS_ROUTE.replace("/", "\\/")}`);

    // Fill the form
    const username = `${randomString(10)}*iov`;
    await page.type(`input[name="${REGISTER_USERNAME_FIELD}"]`, username);
    await page.click('button[type="submit"]');

    await acceptEnqueuedRequest(browser);
    await page.bringToFront();
    await sleep(1000);
    const buttons = await page.$$("button");
    await buttons[2].click();

    await waitForUsername(await page.$$("h5"));
    const personaAddress = await getUsernameE2E(await page.$$("h5"));
    expect(personaAddress).toBe(username);
  }, 45000);
});
