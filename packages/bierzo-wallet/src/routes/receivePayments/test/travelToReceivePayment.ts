import { Page } from 'puppeteer';

import { whenOnNavigatedToE2eRoute } from '../../../utils/test/navigation';
import { RECEIVE_FROM_IOV_USER } from '../../paths';

export async function travelToReceivePaymentE2E(page: Page): Promise<void> {
  await page.click(`#${RECEIVE_FROM_IOV_USER.replace('/', '\\/')}`);
  await whenOnNavigatedToE2eRoute(page, RECEIVE_FROM_IOV_USER);
}
