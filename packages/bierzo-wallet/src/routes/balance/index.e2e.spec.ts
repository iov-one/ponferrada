import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import { closeBrowser, createExtensionPage, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { getNoFundsMessage, getNoFundsMessageE2E } from './test/operateBalances';
import { travelToBalanceE2E } from './test/travelToBalance';

withChainsDescribe(
  'E2E > Balance route',
  (): void => {
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
      await travelToBalanceE2E(browser, page, extensionPage);
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    afterAll(() => {
      server.close();
    });

    it('should contain "No funds available" message', async (): Promise<void> => {
      const noFundsMessage = await getNoFundsMessageE2E(await page.$$('h6'));

      expect(noFundsMessage).toBe('No funds available');
    }, 45000);
  },
);
