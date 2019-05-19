import { Browser, Page } from 'puppeteer';

import { closeBrowser, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { submitRecoveryPhraseE2E } from './test/fillRecoveryPhrase';
import { travelToRestoreAccountStep } from './test/travelToRestoreAccount';

withChainsDescribe(
  'E2E > Restore Account route',
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

    it('should redirect to restore account route, fill recovery phrase and redirect to account route', async (): Promise<
      void
    > => {
      await travelToRestoreAccountStep(page);

      const mnemonic = 'degree tackle suggest window test behind mesh extra cover prepare oak script';
      await submitRecoveryPhraseE2E(page, mnemonic);
    }, 60000);
  },
);
