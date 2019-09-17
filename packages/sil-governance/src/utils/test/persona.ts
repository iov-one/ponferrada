import { Page } from "puppeteer";
import { sleep } from "ui-logic";

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

export async function acceptGetIdentitiesRequest(page: Page): Promise<void> {
  await page.bringToFront();

  // click on drawer
  await page.click('[aria-label="Open drawer"]');
  await sleep(1000);

  // click on Requests
  await page.click("#account-drawer > nav > div:nth-of-type(2)");
  await sleep(500);

  // click on first request
  await page.click("ul > li > div");
  await sleep(500);

  // accept it
  await page.click("button");
}

export async function rejectGetIdentitiesRequest(page: Page): Promise<void> {
  await page.bringToFront();

  // click on drawer
  await page.click('[aria-label="Open drawer"]');
  await sleep(1000);

  // click on Requests
  await page.click("#account-drawer > nav > div:nth-of-type(2)");
  await sleep(500);

  // click on first request
  await page.click("ul > li > div");
  await sleep(500);

  // reject it
  await page.click("button:nth-of-type(2)");
  await sleep(500);

  // confirm rejection
  await page.click("button");
}
