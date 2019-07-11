import { Browser, Page } from 'puppeteer';

import { getBackgroundPage } from '../../../utils/test/e2e';
import { whenOnNavigatedToE2eRoute } from '../../../utils/test/navigation';
import { acceptGetIdentitiesRequest, submitExtensionSignupForm } from '../../../utils/test/persona';
import { sleep } from '../../../utils/timer';
import { BALANCE_ROUTE } from '../../paths';
import { travelToWelcomeE2e } from '../../welcome/test/travelToWelcome';

export async function travelToBalance(browser: Browser, page: Page, extensionPage: Page): Promise<void> {
  await getBackgroundPage(browser);
  await submitExtensionSignupForm(extensionPage, 'username', '12345678');
  await page.bringToFront();
  await travelToWelcomeE2e(page);
  await sleep(1000);
  await acceptGetIdentitiesRequest(extensionPage);
  await page.bringToFront();
  await whenOnNavigatedToE2eRoute(page, BALANCE_ROUTE);
}
