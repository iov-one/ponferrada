import puppeteer, { Page, Browser } from 'puppeteer';
import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from '../../theme/constants';

export function launchBrowser(slowMo: number = 0): Promise<Browser> {
  const CRX_PATH = require('path').join(__dirname, '../../../build');
  return puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo,
    args: [`--disable-extensions-except=${CRX_PATH}`, `--load-extension=${CRX_PATH}`],
    defaultViewport: {
      width: EXTENSION_WIDTH,
      height: EXTENSION_HEIGHT,
    },
  });
}

export async function createPage(browser: Browser): Promise<Page> {
  const page: Page = await browser.newPage();
  await page.goto('chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html', {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  return page;
}

export function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}
