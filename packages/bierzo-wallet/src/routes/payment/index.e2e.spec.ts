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
import { acceptEnqueuedRequest, openEnqueuedRequest, rejectEnqueuedRequest } from '../../utils/test/persona';
import { findRenderedE2EComponentWithId } from '../../utils/test/reactElemFinder';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import { travelToBalanceE2E } from '../balance/test/travelToBalance';
import { PAYMENT_CONFIRMATION_VIEW_ID } from './components/ConfirmPayment';
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
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('should make payment and redirected to payment confirmation page', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await sleep(18000); // wait for faucet to finish its job

    await travelToPaymentE2E(page);
    await fillPaymentForm(page);
    await acceptEnqueuedRequest(extensionPage);
    await page.bringToFront();
    await findRenderedE2EComponentWithId(page, PAYMENT_CONFIRMATION_VIEW_ID);
  }, 35000);

  it('should have proper information about payment request', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await sleep(18000); // wait for faucet to finish its job

    await travelToPaymentE2E(page);
    await fillPaymentForm(page);
    await openEnqueuedRequest(extensionPage);
    await sleep(1000);

    const beneficiary = await getPaymentRequestData(extensionPage, 2);
    const amount = await getPaymentRequestData(extensionPage, 3);
    const fee = await getPaymentRequestData(extensionPage, 5);

    expect(beneficiary).toBe('tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku');
    expect(amount).toBe('1 BASH');
    expect(fee).toBe('0.01 CASH');
  }, 35000);

  it('should show toast message in case if payment will be rejected', async () => {
    await travelToBalanceE2E(browser, page, extensionPage);
    await sleep(18000); // wait for faucet to finish its job

    await travelToPaymentE2E(page);
    await fillPaymentForm(page);
    await rejectEnqueuedRequest(extensionPage);
    await page.bringToFront();

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe('Request rejected');
    await closeToast(page);
  }, 35000);
});
