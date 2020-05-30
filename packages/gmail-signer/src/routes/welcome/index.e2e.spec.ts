import { Browser, Page } from "puppeteer";

import { closeBrowser, createPage, launchBrowser } from "../../utils/test/e2e";
import { WELCOME_ROUTE } from "../paths";

describe("DOM > Welcome route", (): void => {
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

  it("loads correctly", async (): Promise<void> => {
    const inner = await page.evaluate((id: string): string | undefined => {
      const element = document.getElementById(id);
      if (!element) {
        return undefined;
      }

      return element.id;
    }, WELCOME_ROUTE);

    expect(inner).toBe(WELCOME_ROUTE);
  }, 45000);
});
