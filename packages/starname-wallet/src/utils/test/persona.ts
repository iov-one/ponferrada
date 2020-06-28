import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { createExtensionPage } from "./e2e";
import { whenOnNavigatedToE2eRoute } from "./navigation";

const CREATE_WALLET_ID_STEP_1 = "create-wallet-step1";
const CREATE_WALLET_ID_STEP_2 = "create-wallet-step2";
const CREATE_WALLET_ID_STEP_3 = "create-wallet-step3";
const PASSWORD_FIELD = "passwordInputField";
const PASSWORD_CONFIRM_FIELD = "passwordConfirmInputField";
const TERMS_ACCEPT_FIELD = "termsAcceptCheckboxField";

async function clickCreatePersona(page: Page): Promise<void> {
  await page.click("#welcome-create-wallet");
}

export const submitExtensionCreateWalletForm = async (page: Page, password: string): Promise<void> => {
  await clickCreatePersona(page);

  // Fill the form
  await page.waitForSelector(`#${CREATE_WALLET_ID_STEP_1}`);
  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}"]`, password);
  await page.click(`input[name="${TERMS_ACCEPT_FIELD}"]`);
  await page.click('button[type="submit"]');

  // Show recovery words page
  await page.waitForSelector(`#${CREATE_WALLET_ID_STEP_2}`);
  const buttons = await page.$$("button");
  await buttons[1].click();

  // Security hint page
  await page.waitForSelector(`#${CREATE_WALLET_ID_STEP_3}`);
  await page.click('button[type="submit"]');
  await whenOnNavigatedToE2eRoute(page, "/wallet");
};

export async function clickOnFirstRequest(browser: Browser): Promise<Page> {
  const extensionPage = await createExtensionPage(browser);
  await extensionPage.bringToFront();

  // click on first request
  await extensionPage.click("#wallet-sidepanel ul > li > div");
  await sleep(500);

  return extensionPage;
}

export async function acceptEnqueuedRequest(browser: Browser): Promise<void> {
  const extensionPage = await clickOnFirstRequest(browser);

  const buttons = await extensionPage.$$("button");

  // accept it
  await buttons[3].click();
}

export async function rejectEnqueuedRequest(browser: Browser): Promise<void> {
  const extensionPage = await clickOnFirstRequest(browser);

  let buttons = await extensionPage.$$("button");

  // reject it
  await buttons[4].click();
  await sleep(500);

  buttons = await extensionPage.$$("button");
  // confirm rejection
  await buttons[3].click();
}
