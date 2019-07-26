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
import { whenOnNavigatedToE2eRoute } from '../../utils/test/navigation';
import { acceptEnqueuedRequest, rejectEnqueuedRequest } from '../../utils/test/persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { BALANCE_ROUTE } from '../paths';
import { fillPaymentForm } from './test/operatePayment';
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

  it('should make payment and redirected when enqueued request is accepted', async (): Promise<void> => {
    await fillPaymentForm(page);
    await acceptEnqueuedRequest(extensionPage);
    await page.bringToFront();
    await whenOnNavigatedToE2eRoute(page, BALANCE_ROUTE);
  }, 25000);

  it('should show toast message in case if payment will be rejected', async (): Promise<void> => {
    await fillPaymentForm(page);
    await rejectEnqueuedRequest(extensionPage);
    await page.bringToFront();

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe('Request rejected');
    await closeToast(page);
  }, 25000);
});
