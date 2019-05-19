import { Browser, Page } from 'puppeteer';

import { closeBrowser, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import { submitRecoveryPhraseE2E } from '../restore-account/test/fillRecoveryPhrase';
import { travelToRestoreAccountStep } from '../restore-account/test/travelToRestoreAccount';

withChainsDescribe('E2E > Account route', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);

    await travelToRestoreAccountStep(page);
    const mnemonic = 'degree tackle suggest window test behind mesh extra cover prepare oak script';
    await submitRecoveryPhraseE2E(page, mnemonic);
  }, 10000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  it('can create a new account', async () => {
    await sleep(500);

    // click 2nd item (nothing happens)
    await page.click(`input[name="SELECT_FIELD_ATTR"]`);
    await page.click(`div[role="tooltip"] nav > div:nth-child(2)`);

    // click 1st item (create account)
    await page.click(`input[name="SELECT_FIELD_ATTR"]`);
    await page.click(`div[role="tooltip"] nav > div:nth-child(1)`);

    await sleep(1000); // wait for account creation do be done

    // click 3rd item (the newly created account)
    await page.click(`input[name="SELECT_FIELD_ATTR"]`);
    await page.click(`div[role="tooltip"] nav > div:nth-child(3)`);
  }, 20000);
});
