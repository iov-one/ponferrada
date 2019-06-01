import puppeteer, { Browser, Page } from 'puppeteer';
import { extensionId } from '../../communication';

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
  await page.goto('http://localhost:9000/', {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.bringToFront();

  return page;
}

export async function createExtensionPage(browser: Browser): Promise<Page> {
  const page: Page = await browser.newPage();
  await page.goto('chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html', {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('EXTENSION PAGE LOG:', msg.text()));
  page.bringToFront();

  return page;
}

export async function getBackgroundPage(browser: Browser): Promise<Page> {
  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    target => target.type() === 'background_page' && target.url().includes(extensionId),
  );
  if (!backgroundPageTarget) {
    throw new Error('Unable to find extension background page');
  }
  const page = await backgroundPageTarget.page();
  page.on('console', msg => console.log('BACKGROUND PAGE LOG:', msg.text()));
  return page;
}

export function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}

export async function closeToast(page: Page): Promise<void> {
  return page.click('[aria-label="Close"]');
}
