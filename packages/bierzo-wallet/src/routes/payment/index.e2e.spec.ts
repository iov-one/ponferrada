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
import { openEnqueuedRequest, rejectEnqueuedRequest } from '../../utils/test/persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import { fillPaymentForm, getPaymentRequestData } from './test/operatePayment';
import { travelToPaymentE2E } from './test/travelToPayment';

withChainsDescribe('E2E > Payment route', () => {
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
    await travelToPaymentE2E(browser, page, extensionPage);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('should have proper information about payment request', async () => {
    await fillPaymentForm(page);
    await openEnqueuedRequest(extensionPage);
    await sleep(1000);

    const beneficiary = await getPaymentRequestData(extensionPage, 2);
    const amount = await getPaymentRequestData(extensionPage, 3);
    const fee = await getPaymentRequestData(extensionPage, 5);

    expect(beneficiary).toBe('tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku');
    expect(amount).toBe('1 BASH');
    expect(fee).toBe('0.01 CASH');
  }, 25000);

  it('should show toast message in case if payment will be rejected', async () => {
    await fillPaymentForm(page);
    await rejectEnqueuedRequest(extensionPage);
    await page.bringToFront();

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe('Request rejected');
    await closeToast(page);
  }, 25000);
});
