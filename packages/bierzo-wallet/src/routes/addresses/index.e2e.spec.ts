import clipboardy from "clipboardy";
import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { closeBrowser, closeToast, createPage, getToastMessage, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest } from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { registerPersonalizedAddress, waitForAllBalances } from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import {
  copyAddress,
  getAddressRow,
  getLinkedAddresses,
  getRemoveActions,
  getStarnames,
} from "./test/operateReceivePayment";
import {
  openFirstStarnameForEditingE2E,
  travelToAddressesE2E,
  travelToBlockchainAddressesTabE2E,
  travelToStarnamesTabE2E,
} from "./test/travelToReceivePayment";

withChainsDescribe("E2E > Receive Payment route", () => {
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

  describe("Addresses tab", () => {
    beforeEach(async () => {
      await travelToBlockchainAddressesTabE2E(page);
    }, 60000);

    it("should open tab, check list of addresses and copy address to clipboard", async () => {
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
    }, 35000);
  });

  describe("Starnames tab", () => {
    let username: string;
    beforeEach(async () => {
      await travelToStarnamesTabE2E(page);
      username = await registerPersonalizedAddress(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);
    }, 60000);

    it("should open tab, check list of addresses and copy address to clipboard", async () => {
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
    }, 35000);

    it("should check username open it and remove last address", async () => {
      const addresses = await getLinkedAddresses(page);

      await openFirstStarnameForEditingE2E(page, username);
      const [removeFirstAddressAction] = await getRemoveActions(page);
      await removeFirstAddressAction.click();
      await page.click('button[type="submit"]');

      await acceptEnqueuedRequest(browser);
      await page.bringToFront();
      await sleep(1000);
      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);
      const addressesUpdated = await getLinkedAddresses(page);
      // Remove first address to compare it with current linked addresses state
      addresses.splice(0, 1);
      expect(addressesUpdated).toEqual(addresses);
    }, 35000);

    it("should open tab, create couple of address and check main window", async () => {
      const username2 = await registerPersonalizedAddress(browser, page);

      await travelToAddressesE2E(page);
      await travelToStarnamesTabE2E(page);

      const starnames = await getStarnames(page);
      expect(starnames).toEqual([username, username2]);
    }, 35000);
  });
});
