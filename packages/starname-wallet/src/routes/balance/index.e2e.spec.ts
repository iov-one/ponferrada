import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import {
  getAddressCreationPromptE2E,
  getBalanceTextAtIndex,
  registerIovname,
  waitForAllBalances,
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
      await getBalanceTextAtIndex(await page.$$("h5"), 0),
      await getBalanceTextAtIndex(await page.$$("h5"), 1),
      await getBalanceTextAtIndex(await page.$$("h5"), 2),
      await getBalanceTextAtIndex(await page.$$("h5"), 3),
    ];

    expect(balances).toEqual(["10 BASH", "10 CASH", "10 ETH", "5 LSK"]);
  }, 45000);

  it("should contain message to get address", async () => {
    const username = await getAddressCreationPromptE2E(await page.$$("h6"));

    expect(username).toBe("You have no iovnames");
  }, 45000);

  it("should create personalized address", async () => {
    await registerIovname(browser, page);
  }, 45000);
});
