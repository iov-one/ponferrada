import puppeteer, { Browser, Page } from 'puppeteer';
import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from '../../../theme/constants';
import { SIGNUP_ROUTE } from '../../paths';

describe('DOM > Signup route', () => {
  let browser: Browser;

  beforeEach(async () => {
    const CRX_PATH = require('path').join(__dirname, '../../../../build');
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
  });

  afterEach(async () => {
    await browser.close();
  });

  it('loads correctly', async () => {
    const page: Page = await browser.newPage();
    await page.goto(
      'chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html',
      { waitUntil: 'networkidle2' }
    );

    const inner = await page.evaluate(async (id: string) => {
      const element = document.getElementById(id);
      if (!element) {
        return undefined;
      }

      return element.id;
    }, SIGNUP_ROUTE);

    expect(inner).toBe(SIGNUP_ROUTE);
  }, 45000);
});
