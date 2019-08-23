import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { travelToBalanceE2E } from "../../../../routes/balance/test/travelToBalance";
import { LOGIN_ROUTE } from "../../../../routes/paths";
import { closeBrowser, createPage, launchBrowser } from "../../../../utils/test/e2e";
import { whenOnNavigatedToE2eRoute } from "../../../../utils/test/navigation";
import { withChainsDescribe } from "../../../../utils/test/testExecutor";
import { LOG_OUT_ID, MENU_ID } from "./index";

withChainsDescribe("E2E > Hi Menu component", () => {
  let browser: Browser;
  let page: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../../../build")));

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

  it("should click on logout", async () => {
    await travelToBalanceE2E(browser, page);
    await page.click(`#${MENU_ID}`);
    await sleep(500);
    await page.click(`#${LOG_OUT_ID}`);
    await whenOnNavigatedToE2eRoute(page, LOGIN_ROUTE);
  }, 35000);
});
