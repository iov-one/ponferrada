import puppeteer, { Page, Browser } from 'puppeteer';

export function launchBrowser(slowMo: number = 0): Promise<Browser> {
  const CRX_PATH = require('path').join(__dirname, '../../../../sanes-chrome-extension/build');
  return puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo,
    args: [`--disable-extensions-except=${CRX_PATH}`, `--load-extension=${CRX_PATH}`],
  });
}

export async function createPage(browser: Browser): Promise<Page> {
  const page: Page = await browser.newPage();
  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.bringToFront();

  return page;
}

export function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}
