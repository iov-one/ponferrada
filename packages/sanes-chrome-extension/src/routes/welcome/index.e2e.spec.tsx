import puppeteer, { Browser, Page } from 'puppeteer';
import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from '../../theme/constants';
import { WELCOME_ROUTE } from '../paths';

describe('DOM > Welcome route', (): void => {
  let browser: Browser;

  beforeEach(async (): Promise<void> => {
    const CRX_PATH = require('path').join(__dirname, '../../../build');
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      // slowMo: 200,
      args: [
        `--disable-extensions-except=${CRX_PATH}`,
        `--load-extension=${CRX_PATH}`,
      ],
      defaultViewport: {
        width: EXTENSION_WIDTH,
        height: EXTENSION_HEIGHT,
      },
    });
  }, 45000);

  afterEach(
    async (): Promise<void> => {
      await browser.close();
    }
  );

  it('loads correctly', async (): Promise<void> => {
    const page: Page = await browser.newPage();
    await page.goto(
      'chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html',
      { waitUntil: 'networkidle2' }
    );

    const inner = await page.evaluate(async (id: string): Promise<
      string | undefined
    > => {
      const element = document.getElementById(id);
      if (!element) {
        return undefined;
      }

      return element.id;
    }, WELCOME_ROUTE);

    expect(inner).toBe(WELCOME_ROUTE);
  }, 45000);
});
