import puppeteer, { Browser, Page } from 'puppeteer';

import { getConfig } from '../../config';

export function launchBrowser(slowMo: number = 0, install: boolean = true): Promise<Browser> {
  const CRX_PATH = require('path').join(__dirname, '../../../../sanes-chrome-extension/build');
  const args = install ? [`--disable-extensions-except=${CRX_PATH}`, `--load-extension=${CRX_PATH}`] : [];

  return puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo,
    args,
  });
}

export async function createPage(browser: Browser): Promise<Page> {
  const page: Page = await browser.newPage();
  await page.goto('http://localhost:9000/', {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.bringToFront();

  return page;
}

export async function createExtensionPage(browser: Browser): Promise<Page> {
  const config = getConfig();

  const page: Page = await browser.newPage();
  await page.goto(`chrome-extension://${config.extensionId}/index.html`, {
    waitUntil: 'networkidle2',
  });
  page.on('console', msg => console.log('EXTENSION PAGE LOG:', msg.text()));
  await page.bringToFront();

  return page;
}

export async function getBackgroundPage(browser: Browser): Promise<Page> {
  const config = getConfig();

  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    target => target.type() === 'background_page' && target.url().includes(config.extensionId),
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
