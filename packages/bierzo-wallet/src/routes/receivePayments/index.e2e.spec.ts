import clipboardy from 'clipboardy';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import {
  closeBrowser,
  closeToast,
  createExtensionPage,
  createPage,
  getToastMessage,
  launchBrowser,
} from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { waitForAllBalances } from '../balance/test/operateBalances';
import { travelToBalanceE2E } from '../balance/test/travelToBalance';
import { copyAddress, getAddressRow } from './test/operateReceivePayment';
import { travelToReceivePaymentE2E } from './test/travelToReceivePayment';

withChainsDescribe('E2E > Receive Payment route', () => {
  let browser: Browser;
  let page: Page;
  let extensionPage: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require('path').join(__dirname, '/../../../build')));

    app.get('/*', function(req: Request, res: Response) {
      res.sendFile(require('path').join(__dirname, 'build', 'index.html'));
    });

    server = app.listen(9000);
  });

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('should redirecto to receive payment route and check list of addresses', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await waitForAllBalances(page);

    await travelToReceivePaymentE2E(page);
    let [chainName, address] = await getAddressRow(page, 1);
    expect(chainName).toBe('Ganache');
    expect(address.length).toBe(42);

    [chainName, address] = await getAddressRow(page, 4);
    expect(chainName).toBe('IOV Devnet');
    expect(address.length).toBe(43);

    [chainName, address] = await getAddressRow(page, 5);
    expect(chainName).toBe('Lisk Devnet');
  }, 35000);

  it('should copy address to clipboard and show toast with message', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await waitForAllBalances(page);

    await travelToReceivePaymentE2E(page);
    let address = await copyAddress(page, 1);

    expect(clipboardy.readSync()).toBe(address);

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe('Address has been copied to clipboard.');
    await closeToast(page);
  }, 35000);
});
