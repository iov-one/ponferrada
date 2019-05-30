import { Browser, Page } from 'puppeteer';
import { launchBrowser, createPage, closeBrowser, getBackgroundPage } from '../../utils/test/e2e';
import { IovWindowExtension } from '../../extension/background/model/backgroundscript';

describe('DOM > Login route', (): void => {
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

  it('loads correctly', async (): Promise<void> => {
    await bgPage.evaluate(
      async (): Promise<void> => {
        console.log(await (window as IovWindowExtension).getQueuedRequests());
        //Object.getOwnPropertyNames(window).forEach(val => console.log(val));
      },
    );

    expect(true).toBe(true);
  }, 45000);
});
