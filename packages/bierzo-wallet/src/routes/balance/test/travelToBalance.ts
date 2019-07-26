import { Browser, Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../routes';
import { createDom } from '../../../utils/test/dom';
import { getBackgroundPage } from '../../../utils/test/e2e';
import { whenOnNavigatedToE2eRoute, whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { acceptEnqueuedRequest, submitExtensionSignupForm } from '../../../utils/test/persona';
import { sleep } from '../../../utils/timer';
import { BALANCE_ROUTE } from '../../paths';

export const travelToBalance = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act((): void => {
    history.push(BALANCE_ROUTE);
  });
  await whenOnNavigatedToRoute(BALANCE_ROUTE);

  return dom;
};

export async function travelToBalanceE2E(browser: Browser, page: Page, extensionPage: Page): Promise<void> {
  await getBackgroundPage(browser);
  await submitExtensionSignupForm(extensionPage, 'username', '12345678');
  await page.bringToFront();
  //Click on login button
  await page.click('button');
  await sleep(1000);
  await acceptEnqueuedRequest(extensionPage);
  await page.bringToFront();
  await whenOnNavigatedToE2eRoute(page, BALANCE_ROUTE);
}
