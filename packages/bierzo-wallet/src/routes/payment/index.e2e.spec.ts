import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { closeBrowser, closeToast, createPage, getToastMessage, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest, clickOnFirstRequest, rejectEnqueuedRequest } from "../../utils/test/persona";
import { findRenderedE2EComponentWithId } from "../../utils/test/reactElemFinder";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { waitForAllBalances } from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import { PAYMENT_CONFIRMATION_VIEW_ID } from "./components/ConfirmPayment";
import { fillPaymentForm, getInvalidAddressError, getPaymentRequestData } from "./test/operatePayment";
import { travelToPaymentE2E } from "./test/travelToPayment";

withChainsDescribe("E2E > Payment route", () => {
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
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("should make payment and redirected to payment confirmation page", async () => {
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToPaymentE2E(page);
    await fillPaymentForm(page, "1", "tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku");
    await acceptEnqueuedRequest(browser);
    await page.bringToFront();
    await findRenderedE2EComponentWithId(page, PAYMENT_CONFIRMATION_VIEW_ID);
  }, 35000);

  it("should not let to make payment address is not valid", async () => {
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToPaymentE2E(page);
    await fillPaymentForm(page, "1", "not_valid_address");
    const validationError = await getInvalidAddressError(page);
    expect(validationError).toBe("Must be an IOV human readable address or a native address");
  }, 35000);

  it("should have proper information about payment request", async () => {
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToPaymentE2E(page);
    await fillPaymentForm(page, "1", "tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku");
    const extensionPage = await clickOnFirstRequest(browser);
    await sleep(1000);

    const beneficiary = await getPaymentRequestData(extensionPage, 2);
    const amount = await getPaymentRequestData(extensionPage, 3);
    const fee = await getPaymentRequestData(extensionPage, 5);

    expect(beneficiary).toBe("tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku");
    expect(amount).toBe("1 BASH");
    expect(fee).toBe("0.01 CASH");
  }, 35000);

  it("should show toast message in case if payment will be rejected", async () => {
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToPaymentE2E(page);
    await fillPaymentForm(page, "1", "tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku");
    await rejectEnqueuedRequest(browser);
    await page.bringToFront();

    const toastMessage = await getToastMessage(page);
    expect(toastMessage).toBe("Request rejected");
    await closeToast(page);
  }, 35000);
});
