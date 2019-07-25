import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import { closeBrowser, createExtensionPage, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { QUANTITY_FIELD } from './components/CurrencyToSend';
import { ADDRESS_FIELD } from './components/ReceiverAddress';
import { travelToPaymentE2E } from './test/travelToPayment';

withChainsDescribe('E2E > Payment route', (): void => {
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

  beforeEach(async (): Promise<void> => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await travelToPaymentE2E(browser, page, extensionPage);
  }, 45000);

  afterEach(
    async (): Promise<void> => {
      await closeBrowser(browser);
    },
  );

  afterAll(() => {
    server.close();
  });

  fit('should fill payment form and make payment', async (): Promise<void> => {
    await page.type(`input[name="${QUANTITY_FIELD}"]`, '1');
    await page.type(`input[name="${ADDRESS_FIELD}`, 'tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku');
    await page.click('button:nth-of-type(1)');
  }, 45000);
});
