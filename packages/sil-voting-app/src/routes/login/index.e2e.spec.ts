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
import { whenOnNavigatedToE2eRoute } from '../../utils/test/navigation';
import {
  acceptGetIdentitiesRequest,
  rejectGetIdentitiesRequest,
  submitExtensionSignupForm,
} from '../../utils/test/persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { sleep } from '../../utils/timer';
import { travelToDashboardE2e } from '../dashboard/test/travelToDashboard';
import { DASHBOARD_ROUTE } from '../paths';

withChainsDescribe(
  'E2E > Login route',
  (): void => {
    let browser: Browser;
    let page: Page;
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

    async function checkLoginMessage(page: Page): Promise<void> {
      const element = await page.$('h6');
      if (element === null) {
        throw new Error();
      }
      const text = await (await element.getProperty('textContent')).jsonValue();
      expect(text).toBe(LOGIN_EXTENSION_MSG);

      await closeToast(page);
    }

    it('should redirect when enqueued login request is accepted', async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
      await getBackgroundPage(browser);
      await submitExtensionSignupForm(extensionPage, 'username', '12345678');
      await page.bringToFront();
      await travelToDashboardE2e(page);
      await sleep(1000);
      await acceptGetIdentitiesRequest(extensionPage);
      await page.bringToFront();
      await whenOnNavigatedToE2eRoute(page, DASHBOARD_ROUTE);
    }, 45000);

    it('should stay in login view if enqueued login request is rejected', async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      extensionPage = await createExtensionPage(browser);
      await getBackgroundPage(browser);
      await submitExtensionSignupForm(extensionPage, 'username', '12345678');
      await page.bringToFront();
      await travelToDashboardE2e(page);
      await sleep(1000);
      await rejectGetIdentitiesRequest(extensionPage);
      await page.bringToFront();
      await checkLoginMessage(page);
    }, 45000);

    it('shows login to IOV extension if not persona detected', async (): Promise<void> => {
      browser = await launchBrowser();
      page = await createPage(browser);
      await getBackgroundPage(browser);
      await page.bringToFront();
      await sleep(1000);

      await page.click('button');
      await sleep(500);

      await checkLoginMessage(page);
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
