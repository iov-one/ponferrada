import clipboardy from "clipboardy";
import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";

import { closeBrowser, closeToast, createPage, getToastMessage, launchBrowser } from "../../utils/test/e2e";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import {
  registerIovname,
  registerName,
  registerStarname,
  waitForAllBalances,
} from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import { copyAddress, getAddressRow, getIovnames, getStarnames } from "./test/operateReceivePayment";
import {
  manageFirstIovnameE2E,
  manageFirstNameE2E,
  manageFirstStarnameE2E,
  travelToAddressesE2E,
  travelToBlockchainAddressesTabE2E,
  travelToIovnamesTabE2E,
  travelToStarnamesTabE2E,
} from "./test/travelToReceivePayment";

withChainsDescribe.only("E2E > Addresses route", () => {
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
    await waitForAllBalances(page);
    await travelToAddressesE2E(page);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  describe("Blockchain addresses tab", () => {
    beforeEach(async () => {
      await travelToBlockchainAddressesTabE2E(page);
    }, 60000);

    it("allows copying addresses to clipboard by clicking icon", async () => {
      let [chainName, address] = await getAddressRow(page, 1);
      expect(chainName).toBe("Ganache");
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);

      [chainName, address] = await getAddressRow(page, 2);
      expect(chainName).toBe("IOV Devnet");
      expect(address).toMatch(/^tiov1[0-9a-z]{38}$/);

      [chainName, address] = await getAddressRow(page, 3);
      expect(chainName).toBe("Lisk Devnet");
      expect(address).toMatch(/^[0-9]+L$/);

      const blockchainAddress = await copyAddress(page, 1);

      expect(clipboardy.readSync()).toBe(blockchainAddress);

      const toastMessage = await getToastMessage(page);
      expect(toastMessage).toBe("Address has been copied to clipboard.");
      await closeToast(page);
    }, 60000);
  });

  describe("Iovnames tab", () => {
    let iovname: string;

    beforeEach(async () => {
      await travelToIovnamesTabE2E(page);
      iovname = await registerIovname(browser, page);

      await travelToAddressesE2E(page);
      await travelToIovnamesTabE2E(page);
    }, 60000);

    it("has a register iovname link and shows all registered iovnames", async () => {
      const iovname2 = await registerIovname(browser, page);

      await travelToAddressesE2E(page);
      await travelToIovnamesTabE2E(page);

      const iovnames = await getIovnames(page);
      const expected = [iovname, iovname2].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );

      expect(iovnames).toEqual(expected);
    }, 60000);

    it('iovnames have "Manage" links that redirect to the Manage route for that iovname', async () => {
      await manageFirstIovnameE2E(page);
      await page.$x(`//h6[contains(., '${iovname}')]`);
    }, 60000);
  });

  describe("Starnames tab", () => {
    let starname: string;

    beforeEach(async () => {
      await travelToStarnamesTabE2E(page);
      starname = await registerStarname(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);
    }, 60000);

    it("has a register starname link and shows all registered starnames", async () => {
      const starname2 = await registerStarname(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);

      const starnames = await getStarnames(page);
      const expected = [starname, starname2].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );

      expect(starnames).toEqual(expected);
    }, 60000);

    it("shows names besides starnames", async () => {
      await manageFirstStarnameE2E(page);
      const name = await registerName(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);

      const starnamesAndNames = await getStarnames(page);
      const expected = [starname, name].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );

      expect(starnamesAndNames).toEqual(expected);
    }, 60000);

    it('starnames have "Manage" links that redirect to the Manage route for that starname', async () => {
      await manageFirstStarnameE2E(page);
      await page.$x(`//h6[contains(., '${starname}')]`);
    }, 60000);

    it('names have "Manage" links that redirect to the Manage route for that name', async () => {
      await manageFirstStarnameE2E(page);
      const name = await registerName(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);

      await manageFirstNameE2E(page);
      await page.$x(`//h6[contains(., '${name}')]`);
    }, 60000);
  });
});
