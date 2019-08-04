import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import { createExtensionPage, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { waitForAllBalances } from '../balance/test/operateBalances';
import { travelToBalanceE2E } from '../balance/test/travelToBalance';
import { getAddressRow } from './test/operateReceivePayment';
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
    //await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('should redirecto to receive payment route and check list of addresses', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await waitForAllBalances(page);

    await travelToReceivePaymentE2E(page);
    const rowText = await getAddressRow(page, 1);
    console.log(rowText);
    await page.bringToFront();
  }, 35000);
});
