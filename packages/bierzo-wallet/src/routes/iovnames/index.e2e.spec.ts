import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { ACCOUNT_MANAGE_MENU_BUTTON, ACCOUNT_MANAGE_MENU_ITEM } from "../../components/AccountManage";
import { ACCOUNT_OPERATION_SUBMIT_BUTTON } from "../../components/AccountOperation";
import { ACCOUNT_TRANSFER_RECIPIENT } from "../../components/AccountTransfer";
import { closeBrowser, createPage, getElements, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest } from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { TRANSFER_CONFIRMATION_VIEW_ID } from "../account/transfer/components/ConfirmTransfer";
import { registerIovname, waitForAllBalances } from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import { getIovnames, manageFirstIovnameE2E, travelToIovnamesTabE2E } from "./test/operateIovnames";

withChainsDescribe("E2E > Iovnames route", () => {
  let browser: Browser;
  let page: Page;
  let server: Server;
  let iovname: string;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../build")));

    app.get("/*", function(_req: Request, res: Response) {
      res.sendFile(require("path").join(__dirname, "build", "index.html"));
    });

    server = app.listen(9000);
  });

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToIovnamesTabE2E(page);
    iovname = await registerIovname(browser, page);
    await travelToIovnamesTabE2E(page);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("has a register iovname link and shows all registered iovnames", async () => {
    const iovname2 = await registerIovname(browser, page);
    await sleep(2000);

    await travelToIovnamesTabE2E(page);

    await sleep(2000);
    const iovnames = await getIovnames(page);
    const expected = [iovname, iovname2].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );

    expect(iovnames).toEqual(expected);
  }, 60000);

  xit('iovnames have "Manage" links that redirect to the Manage route for that iovname', async () => {
    await manageFirstIovnameE2E(page);
    await page.$x(`//h6[contains(., '${iovname}')]`);
  }, 60000);

  xit("iovnames can be transferred", async () => {
    await manageFirstIovnameE2E(page);

    const [menuButton] = await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON);
    await menuButton.click();
    const [transferLink] = await getElements(page, ACCOUNT_MANAGE_MENU_ITEM);
    await transferLink.click();

    const [recipientParent] = await getElements(page, ACCOUNT_TRANSFER_RECIPIENT);
    const recipientField = await recipientParent.$("input");
    if (!recipientField) throw Error("Recipient field for transfer not found");
    await recipientField.type("test1*iov");

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${TRANSFER_CONFIRMATION_VIEW_ID}`);

    await travelToIovnamesTabE2E(page);

    await sleep(2000);
    const iovnameMatches = await page.$x(`//h5[contains(., '${iovname}')]`);
    expect(iovnameMatches.length).toBe(0);
  }, 60000);
});
