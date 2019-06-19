/*global chrome*/
import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';
import { INSTALL_EXTENSION_MSG, LOGIN_EXTENSION_MSG } from '.';
import {
  closeBrowser,
  closeToast,
  createExtensionPage,
  createPage,
  getBackgroundPage,
  launchBrowser,
} from '../../utils/test/e2e';
import { submitExtensionSignupForm } from '../../utils/test/persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import { travelToWelcomeE2e } from '../welcome/test/travelToWelcome';

withChainsDescribe(
  'DOM > Login route',
  (): void => {
    let browser: Browser;
    let page: Page;
    let backgroundPage: Page;
    let extensionPage: Page;
    let server: Server;

    beforeAll(() => {
      const app = express();

      app.use(express.static(require('path').join(__dirname, '/../../../build')));

      app.get('/*', function(req: Request, res: Response) {
        res.sendFile(require('path').join(__dirname, 'build', 'index.html'));
      });

      server = app.listen(9000);
    });

    beforeEach(async (): Promise<void> => {}, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    afterAll(() => {
      server.close();
    });

    it('should enqueue identity request when login having persona created', async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      backgroundPage = await getBackgroundPage(browser);
      extensionPage = await createExtensionPage(browser);
      await submitExtensionSignupForm(extensionPage, 'username', '12345678');
      await page.bringToFront();
      travelToWelcomeE2e(page);

      await sleep(1500);
      const badgeText = await backgroundPage.evaluate(
        (): Promise<string | undefined> => {
          return new Promise(resolve => {
            chrome.browserAction.getBadgeText({}, text => resolve(text));
          });
        },
      );

      expect(badgeText).toBe('1');
    }, 45000);

    it('shows login to IOV extension if not persona detected', async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      backgroundPage = await getBackgroundPage(browser);
      await page.bringToFront();
      await sleep(1000);

      await page.click('button');
      await sleep(500);

      const element = await page.$('h6');
      if (element === null) {
        throw new Error();
      }
      const text = await (await element.getProperty('textContent')).jsonValue();
      expect(text).toBe(LOGIN_EXTENSION_MSG);

      await closeToast(page);
    }, 45000);

    it('shows install IOV extension message', async (): Promise<void> => {
      browser = await launchBrowser(0, false);
      page = await createPage(browser);
      await page.bringToFront();

      await sleep(1000);

      await page.click('button');
      await sleep(500);

      const element = await page.$('h6');
      if (element === null) {
        throw new Error();
      }
      const text = await (await element.getProperty('textContent')).jsonValue();
      expect(text).toBe(INSTALL_EXTENSION_MSG);

      await closeToast(page);
    }, 45000);
  },
);
