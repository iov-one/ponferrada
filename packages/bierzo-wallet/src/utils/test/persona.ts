import { Page } from 'puppeteer';
import { sleep } from '../timer';
import { whenOnNavigatedToE2eRoute } from './navigation';

const ACCOUNT_NAME_FIELD = 'accountNameField';
const PASSWORD_FIELD = 'passwordInputField';
const PASSWORD_CONFIRM_FIELD = 'passwordConfirmInputField';

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
  await page.click('button[type="submit"]');
  await sleep(1000);
  const buttons = await page.$$('button');
  await buttons[1].click();
  await page.click('button[type="submit"]');
  await whenOnNavigatedToE2eRoute(page, '/account');
};

export async function acceptGetIdentitiesRequest(page: Page): Promise<void> {
  await page.bringToFront();

  //click on drawer
  await page.click('[aria-label="Open drawer"]');
  await sleep(1000);

  // click on Requests
  await page.click('#account-drawer > div:nth-of-type(2)');
  await sleep(500);

  // click on first request
  await page.click('ul > li > div');
  await sleep(500);

  // accept it
  await page.click('button');
}
