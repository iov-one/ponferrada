import { Browser, Page } from 'puppeteer';

import { IovWindowExtension } from '../../extension/background/model/backgroundscript';
import {
  closeBrowser,
  createPage,
  EXTENSION_ID,
  getBackgroundPage,
  launchBrowser,
} from '../../utils/test/e2e';
import { randomString } from '../../utils/test/random';
import { findRenderedE2EComponentWithId } from '../../utils/test/reactElemFinder';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE, LOGIN_ROUTE } from '../paths';
import {
  submitNewAccountE2E,
  submitSecurityHintE2E,
  submitShowPhraseE2E,
  travelToSignupNewAccountStep,
} from '../signup/test/operateSignup';
import { submitE2ELoginForm } from './test/submitLoginForm';

withChainsDescribe(
  'DOM > Login route',
  (): void => {
    let browser: Browser;
    let page: Page;
    let bgPage: Page;

    beforeEach(async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      bgPage = await getBackgroundPage(browser);
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    it('should redirect to login route after browser restart', async (): Promise<void> => {
      await travelToSignupNewAccountStep(page);
      const password = randomString(10);
      await submitNewAccountE2E(page, randomString(10), password);
      await submitShowPhraseE2E(page);
      await submitSecurityHintE2E(page, randomString(10));
      //Simulating reload
      await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`, {
        waitUntil: 'networkidle2',
      });
      await findRenderedE2EComponentWithId(page, ACCOUNT_STATUS_ROUTE);

      await bgPage.evaluate(
        (): void => {
          (window as IovWindowExtension).clearPersona();
        },
      );

      //Simulating reload
      await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`, {
        waitUntil: 'networkidle2',
      });
      await findRenderedE2EComponentWithId(page, LOGIN_ROUTE);
      await submitE2ELoginForm(page, password);
      await findRenderedE2EComponentWithId(page, ACCOUNT_STATUS_ROUTE);
    }, 45000);
  },
);
