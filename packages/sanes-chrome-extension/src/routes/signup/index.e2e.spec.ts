import { Browser, Page } from 'puppeteer';

import { closeBrowser, createPage, launchBrowser } from '../../utils/test/e2e';
import { randomString } from '../../utils/test/random';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { handlePassPhrase2E, handleSecurityHintE2E, submitAccountFormE2E } from './test/fillSignupForm';
import { travelToSignupNewAccountStep } from './test/travelToSignup';

withChainsDescribe(
  'DOM > Signup route',
  (): void => {
    let browser: Browser;
    let page: Page;

    beforeEach(async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    it('should redirect to signup route, fill required data, show recovery phrase and hint', async (): Promise<
      void
    > => {
      await travelToSignupNewAccountStep(page);
      await submitAccountFormE2E(page, randomString(10), randomString(10));
      await handlePassPhrase2E(page);
      await handleSecurityHintE2E(page, randomString(10));
    }, 60000);
  },
);
