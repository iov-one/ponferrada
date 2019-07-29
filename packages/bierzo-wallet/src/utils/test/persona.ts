import { Page } from 'puppeteer';

import { sleep } from '../timer';
import { whenOnNavigatedToE2eRoute } from './navigation';

const ACCOUNT_NAME_FIELD = 'accountNameField';
const PASSWORD_FIELD = 'passwordInputField';
const PASSWORD_CONFIRM_FIELD = 'passwordConfirmInputField';
const TERMS_ACCEPT_FIELD = 'termsAcceptCheckboxField';

async function clickCreatePersona(page: Page): Promise<void> {
  await page.click('button:nth-of-type(2)');
}

export const submitExtensionSignupForm = async (
  page: Page,
  accountName: string,
  password: string,
): Promise<void> => {
  await clickCreatePersona(page);

  // Fill the form
  await page.type(`input[name="${ACCOUNT_NAME_FIELD}"]`, accountName);
  await page.type(`input[name="${PASSWORD_FIELD}`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}`, password);
  await page.click(`input[name="${TERMS_ACCEPT_FIELD}"]`);
  await page.click('button[type="submit"]');
  await sleep(1000);
  const buttons = await page.$$('button');
  await buttons[1].click();
  await page.click('button[type="submit"]');
  await whenOnNavigatedToE2eRoute(page, '/account');
};

export async function openEnqueuedRequest(extensionPage: Page): Promise<void> {
  await extensionPage.bringToFront();

  //click on drawer
  await extensionPage.click('[aria-label="Open drawer"]');
  await sleep(1000);

  // click on Requests
  await extensionPage.click('#account-drawer > nav > div:nth-of-type(2)');
  await sleep(500);

  // click on first request
  await extensionPage.click('ul > li > div');
}

export async function acceptEnqueuedRequest(extensionPage: Page): Promise<void> {
  await openEnqueuedRequest(extensionPage);
  await sleep(500);

  // accept it
  await extensionPage.click('button');

  //go back to accounts
  await extensionPage.click('[aria-label="Go back"]');
}

export async function rejectEnqueuedRequest(extensionPage: Page): Promise<void> {
  await openEnqueuedRequest(extensionPage);
  await sleep(500);

  // reject it
  await extensionPage.click('button:nth-of-type(2)');
  await sleep(500);

  // confirm rejection
  await extensionPage.click('button');

  //go back to accounts
  await extensionPage.click('[aria-label="Go back"]');
}
