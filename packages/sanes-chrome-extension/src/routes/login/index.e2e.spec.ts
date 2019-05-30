import { Browser, Page } from 'puppeteer';
import {
  launchBrowser,
  createPage,
  closeBrowser,
  getBackgroundPage,
  EXTENSION_ID,
} from '../../utils/test/e2e';
import { IovWindowExtension } from '../../extension/background/model/backgroundscript';
import { travelToSignupNewAccountStep } from '../signup/test/travelToSignup';
import {
  submitAccountFormE2E,
  handlePassPhrase2E,
  handleSecurityHintE2E,
} from '../signup/test/fillSignupForm';
import { randomString } from '../../utils/test/random';
import { findRenderedE2EComponentWithId } from '../../utils/test/reactElemFinder';
import { ACCOUNT_STATUS_ROUTE, LOGIN_ROUTE } from '../paths';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { submitLoginForm } from './test/submitLoginForm';

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
      await submitAccountFormE2E(page, randomString(10), password);
      await handlePassPhrase2E(page);
      await handleSecurityHintE2E(page, randomString(10));
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
      await submitLoginForm(page, password);
      await findRenderedE2EComponentWithId(page, ACCOUNT_STATUS_ROUTE);
    }, 45000);
  },
);
