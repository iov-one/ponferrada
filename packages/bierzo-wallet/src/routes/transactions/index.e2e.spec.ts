import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { whenTrue } from "ui-logic";

import { TRANSACTIONS_TAB_TITLE } from "../../components/Header/components/LinksMenu";
import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { whenOnNavigatedToE2eRoute } from "../../utils/test/navigation";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { waitForAllBalances } from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import { TRANSACTIONS_ROUTE } from "../paths";

withChainsDescribe("E2E > Transactions route", () => {
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
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("contains faucet transactions", async () => {
    await waitForAllBalances(page);

    const [txLink] = await page.$x(`//h6[contains(., '${TRANSACTIONS_TAB_TITLE}')]`);
    await txLink.click();
    await whenOnNavigatedToE2eRoute(page, TRANSACTIONS_ROUTE);

    const expectedRowCount = 4;

    // wait for transaction events to populate screen
    await whenTrue(async () => (await page.$$('img[alt="Transaction type"]')).length >= expectedRowCount);

    // TODO: Run some tests in the content of those rows
    const rows = await page.$$('img[alt="Transaction type"]');
    expect(rows.length).toBe(expectedRowCount);
  }, 45000);
});
