/*global chrome*/
import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';
import {
  closeBrowser,
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
  'DOM > Welcome route',
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

    beforeEach(async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
      backgroundPage = await getBackgroundPage(browser);
      await submitExtensionSignupForm(extensionPage, 'username', '12345678');
      await page.bringToFront();
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await closeBrowser(browser);
      },
    );

    afterAll(() => {
      server.close();
    });

    it('should enqueue identity request when login having persona created', async (): Promise<void> => {
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
  },
);
