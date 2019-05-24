import { Page } from 'puppeteer';
import { sleep } from '../../../utils/timer';

const ACCOUNT_NAME_FIELD = 'accountNameField';
const PASSWORD_FIELD = 'passwordInputField';
const PASSWORD_CONFIRM_FIELD = 'passwordConfirmInputField';

export const submitExtensionSignupForm = async (
  page: Page,
  accountName: string,
  password: string,
): Promise<void> => {
  await page.type(`input[name="${ACCOUNT_NAME_FIELD}"]`, accountName);
  await page.type(`input[name="${PASSWORD_FIELD}`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}`, password);
  await page.click('button[type="submit"]');
  await sleep(1000);
  const buttons = await page.$$('button');
  await buttons[1].click();
  await page.click('button[type="submit"]');
};
