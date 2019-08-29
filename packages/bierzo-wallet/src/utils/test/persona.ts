import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { createExtensionPage } from "./e2e";
import { whenOnNavigatedToE2eRoute } from "./navigation";

const PASSWORD_FIELD = "passwordInputField";
const PASSWORD_CONFIRM_FIELD = "passwordConfirmInputField";
const TERMS_ACCEPT_FIELD = "termsAcceptCheckboxField";

async function clickCreatePersona(page: Page): Promise<void> {
  await page.click("button:nth-of-type(2)");
}

export const submitExtensionSignupForm = async (page: Page, password: string): Promise<void> => {
  await clickCreatePersona(page);

  // Fill the form
  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}"]`, password);
  await page.click(`input[name="${TERMS_ACCEPT_FIELD}"]`);
  await page.click('button[type="submit"]');
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();
  await page.click('button[type="submit"]');
  await whenOnNavigatedToE2eRoute(page, "/wallet");
};

export async function clickOnFirstRequest(browser: Browser): Promise<Page> {
  const extensionPage = await createExtensionPage(browser);
  await extensionPage.bringToFront();

  // click on first request
  await extensionPage.click("ul > li > div");
  await sleep(500);

  return extensionPage;
}

export async function acceptEnqueuedRequest(browser: Browser): Promise<void> {
  const extensionPage = await clickOnFirstRequest(browser);

  // accept it
  await extensionPage.click("button");

  //go back to accounts
  await extensionPage.click('[aria-label="Go back"]');

  await extensionPage.close();
}

export async function rejectEnqueuedRequest(browser: Browser): Promise<void> {
  const extensionPage = await clickOnFirstRequest(browser);

  // reject it
  await extensionPage.click("button:nth-of-type(2)");
  await sleep(500);

  // confirm rejection
  await extensionPage.click("button");

  //go back to accounts
  await extensionPage.click('[aria-label="Go back"]');

  await extensionPage.close();
}
