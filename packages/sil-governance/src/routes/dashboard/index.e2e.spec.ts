import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { TX_CONFIRMATION_VIEW_ID } from "../../components/ConfirmTransaction";
import { closeBrowser, createExtensionPage, createPage, launchBrowser } from "../../utils/test/e2e";
import { whenOnNavigatedToE2eRoute } from "../../utils/test/navigation";
import { acceptEnqueuedRequest, loginAsGovernor, rejectEnqueuedRequest } from "../../utils/test/persona";
import { findRenderedE2EComponentWithId } from "../../utils/test/reactElemFinder";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { CREATE_PROPOSAL_ROUTE, DASHBOARD_ROUTE } from "../paths";
import {
  getProposalTitlesE2E,
  sortByExpiryDateE2E,
  sortByStartDateE2E,
  sortByVoteE2E,
  voteNoOnFirstProposalE2E,
  voteYesOnFirstProposalE2E,
} from "./test/operateDashboard";
import { travelToDashboardE2e } from "./test/travelToDashboard";

withChainsDescribe("E2E > Dashboard route", () => {
  let browser: Browser;
  let page: Page;
  let extensionPage: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../build")));

    app.get("/*", function(req: Request, res: Response) {
      res.sendFile(require("path").join(__dirname, "build", "index.html"));
    });

    server = app.listen(9000);
  });

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("has an 'Add New Proposal' button that redirects to /create-proposal", async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await loginAsGovernor(page, extensionPage);

    await page.click("#aside-filter > div:nth-child(2)");
    await whenOnNavigatedToE2eRoute(page, CREATE_PROPOSAL_ROUTE);
  }, 45000);

  it("has a 'Sort by' button that sorts the proposals by 'Expiry Date', 'Start Date', or 'Vote'", async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await loginAsGovernor(page, extensionPage);

    await page.waitForSelector("h6");
    let titles = await getProposalTitlesE2E(page);

    expect(titles[0]).toBe("Amend protocol");
    expect(titles[8]).toBe("Add committee member");

    await sortByExpiryDateE2E(page);
    await sleep(2000);
    titles = await getProposalTitlesE2E(page);

    expect(titles[0]).toBe("Add committee member");
    expect(titles[8]).toBe("Amend protocol");

    await sortByVoteE2E(page);
    await sleep(2000);
    titles = await getProposalTitlesE2E(page);

    expect(titles[0]).toBe("Remove committee member");
    expect(titles[8]).toBe("Release guarantee funds");

    await sortByStartDateE2E(page);
    await sleep(2000);
    titles = await getProposalTitlesE2E(page);

    expect(titles[0]).toBe("Add committee member");
    expect(titles[8]).toBe("Amend protocol");
  }, 45000);

  it("redirects to confirmation page if vote accepted", async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await loginAsGovernor(page, extensionPage);
    await sleep(2000);

    await voteYesOnFirstProposalE2E(page);
    await sleep(1000);
    await acceptEnqueuedRequest(extensionPage);
    await page.bringToFront();
    await sleep(5000);
    await findRenderedE2EComponentWithId(page, TX_CONFIRMATION_VIEW_ID);

    // reset modified proposal
    await travelToDashboardE2e(page);
    await sleep(1000);
    await voteNoOnFirstProposalE2E(page);
    await sleep(1000);
    await acceptEnqueuedRequest(extensionPage);
    await sleep(5000);
  }, 45000);

  it("does not redirect if vote rejected", async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await loginAsGovernor(page, extensionPage);
    await sleep(2000);

    await voteYesOnFirstProposalE2E(page);
    await sleep(1000);
    await rejectEnqueuedRequest(extensionPage);
    await page.bringToFront();
    await whenOnNavigatedToE2eRoute(page, DASHBOARD_ROUTE);
  }, 45000);
});
