import express, { Request, Response } from "express";
import { Server } from "http";
import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { ACCOUNT_MANAGE_MENU_BUTTON, ACCOUNT_MANAGE_MENU_ITEM } from "../../components/AccountManage";
import { ACCOUNT_OPERATION_SUBMIT_BUTTON } from "../../components/AccountOperation";
import { ACCOUNT_TRANSFER_RECIPIENT } from "../../components/AccountTransfer";
import { closeBrowser, createPage, getElements, launchBrowser } from "../../utils/test/e2e";
import { acceptEnqueuedRequest } from "../../utils/test/persona";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { DELETE_CONFIRMATION_VIEW_ID } from "../account/delete/components/ConfirmDelete";
import { ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES } from "../account/manage/components/AssociatedNamesList";
import { RENEW_CONFIRMATION_VIEW_ID } from "../account/renew/components/ConfirmRenew";
import { TRANSFER_CONFIRMATION_VIEW_ID } from "../account/transfer/components/ConfirmTransfer";
import { registerName, registerStarname, waitForAllBalances } from "../balance/test/operateBalances";
import { travelToBalanceE2E } from "../balance/test/travelToBalance";
import { STARNAMES_LIST_EXPIRY_DATE } from "./components/StarnamesExists";
import {
  getStarnames,
  manageFirstNameE2E,
  manageFirstStarnameE2E,
  parseExpiryDateLocaleEnUs,
  travelToStarnamesTabE2E,
} from "./test/operateStarnames";

withChainsDescribe("E2E > Starnames route", () => {
  let server: Server;
  let browser: Browser;
  let page: Page;
  let starname: string;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require("path").join(__dirname, "/../../../build")));

    app.get("/*", function(_req: Request, res: Response) {
      res.sendFile(require("path").join(__dirname, "build", "index.html"));
    });

    server = app.listen(9000);
  });

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    await travelToBalanceE2E(browser, page);
    await waitForAllBalances(page);

    await travelToStarnamesTabE2E(page);
    starname = await registerStarname(browser, page);
    await sleep(2000);
    await travelToStarnamesTabE2E(page);
    await sleep(2000);
  }, 60000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it("has a register starname link and shows all registered starnames", async () => {
    const starname2 = await registerStarname(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const starnames = await getStarnames(page);
    const expected = [starname, starname2].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );

    expect(starnames).toEqual(expected);
  }, 60000);

  it("shows names besides starnames", async () => {
    await manageFirstStarnameE2E(page);
    await sleep(2000);
    const name = await registerName(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const starnamesAndNames = await getStarnames(page);
    const expected = [starname, name].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    expect(starnamesAndNames).toEqual(expected);
  }, 60000);

  it('starnames have "Manage" links that redirect to the Manage route for that starname', async () => {
    await manageFirstStarnameE2E(page);
    await page.$x(`//h6[contains(., '${starname}')]`);
  }, 60000);

  it('names have "Manage" links that redirect to the Manage route for that name', async () => {
    await manageFirstStarnameE2E(page);
    await sleep(2000);
    const name = await registerName(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    await manageFirstNameE2E(page);
    await page.$x(`//h6[contains(., '${name}')]`);
  }, 60000);

  it("starnames can be transferred", async () => {
    await manageFirstStarnameE2E(page);

    const [menuButton] = await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON);
    await menuButton.click();
    const transferLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[1];
    await transferLink.click();

    const [recipientParent] = await getElements(page, ACCOUNT_TRANSFER_RECIPIENT);
    const recipientField = await recipientParent.$("input");
    if (!recipientField) throw Error("Recipient field for transfer not found");
    await recipientField.type("test1*iov");

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${TRANSFER_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const starnameMatches = await page.$x(`//h5[contains(., '${starname}')]`);
    expect(starnameMatches.length).toBe(0);
  }, 60000);

  it("starnames can be renewed", async () => {
    const [expiryLabelElement] = await getElements(page, STARNAMES_LIST_EXPIRY_DATE);
    const expiryLabelString = (await (
      await expiryLabelElement.getProperty("textContent")
    ).jsonValue()) as string;
    const expiryDate = parseExpiryDateLocaleEnUs(expiryLabelString);

    await manageFirstStarnameE2E(page);

    const [menuButton] = await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON);
    await menuButton.click();
    const renewLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[0];
    await renewLink.click();

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${RENEW_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const [newExpiryLabelElement] = await getElements(page, STARNAMES_LIST_EXPIRY_DATE);
    const newExpiryLabelString = (await (
      await newExpiryLabelElement.getProperty("textContent")
    ).jsonValue()) as string;
    const newExpiryDate = parseExpiryDateLocaleEnUs(newExpiryLabelString);

    expect(newExpiryDate > expiryDate).toBeTruthy();
  }, 60000);

  it("starnames can be deleted and delete associated names", async () => {
    await manageFirstStarnameE2E(page);
    await sleep(2000);
    await registerName(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    await manageFirstStarnameE2E(page);

    const [menuButton] = await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON);
    await menuButton.click();
    const deleteLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[2];
    await deleteLink.click();

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${DELETE_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const starnameMatches = await page.$x(`//h5[contains(., '${starname}')]`);
    expect(starnameMatches.length).toBe(0);
  }, 60000);

  it("names can be transferred and trasferred back", async () => {
    // Transfer
    await manageFirstStarnameE2E(page);
    await sleep(2000);
    const name = await registerName(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    await manageFirstStarnameE2E(page);
    const [toggleShowName] = await getElements(page, ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES);
    await toggleShowName.click();
    await sleep(2000);

    const menuButton = (await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON))[1];
    await menuButton.click();
    const transferLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[3];
    await transferLink.click();
    await sleep(2000);

    const [recipientParent] = await getElements(page, ACCOUNT_TRANSFER_RECIPIENT);
    const recipientField = await recipientParent.$("input");
    if (!recipientField) throw Error("Recipient field for transfer not found");
    await recipientField.type("test1*iov");

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${TRANSFER_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const nameMatches = await page.$x(`//h5[contains(., '${name}')]`);
    expect(nameMatches.length).toBe(0);

    // Transfer back

    await manageFirstStarnameE2E(page);
    const [toggleShowName2] = await getElements(page, ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES);
    await toggleShowName2.click();
    await sleep(2000);

    const menuButton2 = (await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON))[1];
    await menuButton2.click();
    const transferBackLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[4];
    await transferBackLink.click();

    const [submitButton2] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton2.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${TRANSFER_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const nameMatches2 = await page.$x(`//h5[contains(., '${name}')]`);
    expect(nameMatches2.length).toBe(1);
  }, 60000);

  it("names can be deleted", async () => {
    await manageFirstStarnameE2E(page);
    await sleep(2000);
    const name = await registerName(browser, page);
    await sleep(2000);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    await manageFirstStarnameE2E(page);
    const [toggleShowName] = await getElements(page, ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES);
    await toggleShowName.click();
    await sleep(2000);

    const menuButton = (await getElements(page, ACCOUNT_MANAGE_MENU_BUTTON))[1];
    await menuButton.click();
    const deleteLink = (await getElements(page, ACCOUNT_MANAGE_MENU_ITEM))[5];
    await deleteLink.click();

    const [submitButton] = await getElements(page, ACCOUNT_OPERATION_SUBMIT_BUTTON);
    await submitButton.click();
    await sleep(2000);

    await acceptEnqueuedRequest(browser);
    await sleep(2000);
    await page.bringToFront();
    await page.waitForSelector(`#${DELETE_CONFIRMATION_VIEW_ID}`);

    await travelToStarnamesTabE2E(page);

    await sleep(2000);
    const nameMatches = await page.$x(`//h5[contains(., '${name}')]`);
    expect(nameMatches.length).toBe(0);
  }, 60000);
});
