/*global chrome*/
import { Browser, Page } from 'puppeteer';
//import { WELCOME_ROUTE } from '../paths';
import {
  launchBrowser,
  createPage,
  createExtensionPage,
  closeBrowser,
  getBackgroundPage,
} from '../../utils/test/e2e';
import { submitExtensionSignupForm } from './test/fillSignupForm';
import { withChainsDescribe } from '../../utils/test/testExecutor';

withChainsDescribe(
  'DOM > Welcome route',
  (): void => {
    let browser: Browser;
    let page: Page;
    let backgroundPage: Page;
    let extensionPage: Page;

    beforeEach(async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
      backgroundPage = await getBackgroundPage(browser);
      await extensionPage.click('button:nth-of-type(2)');
      await submitExtensionSignupForm(extensionPage, 'username', '12345678');
      page.bringToFront();
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    it('should made three share identity requests', async (): Promise<void> => {
      //Create 3 share idenity requests.
      await page.click('button:nth-of-type(2)');
      await page.click('button:nth-of-type(2)');
      await page.click('button:nth-of-type(2)');
      const badgeText = await backgroundPage.evaluate(
        (): Promise<string | undefined> => {
          return new Promise(resolve => {
            chrome.browserAction.getBadgeText({}, text => resolve(text));
          });
        },
      );

      expect(badgeText).toBe('3');
    }, 45000);
  },
);
