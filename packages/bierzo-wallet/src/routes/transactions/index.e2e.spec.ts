import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import { TRANSACTIONS_TEXT } from '../../components/Header/components/LinksMenu';
import { closeBrowser, createExtensionPage, createPage, launchBrowser } from '../../utils/test/e2e';
import { whenOnNavigatedToE2eRoute, whenTrue } from '../../utils/test/navigation';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { waitForAllBalances } from '../balance/test/operateBalances';
import { travelToBalanceE2E } from '../balance/test/travelToBalance';
import { TRANSACTIONS_ROUTE } from '../paths';

withChainsDescribe('E2E > Transactions route', () => {
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
    await travelToBalanceE2E(browser, page, extensionPage);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('contains faucet transactions', async () => {
    await waitForAllBalances(page);

    const [txLink] = await page.$x(`//h6[contains(., '${TRANSACTIONS_TEXT}')]`);
    await txLink.click();
    await whenOnNavigatedToE2eRoute(page, TRANSACTIONS_ROUTE);

    const expectedRowCount = 3; // TODO update number to show ETH one when #412 is done

    // wait for transaction events to populate screen
    await whenTrue(async () => (await page.$$('img[alt="Transaction type"]')).length >= expectedRowCount);

    // TODO: Run some tests in the content of those rows
    const rows = await page.$$('img[alt="Transaction type"]');
    expect(rows.length).toBe(expectedRowCount);
  }, 45000);
});
