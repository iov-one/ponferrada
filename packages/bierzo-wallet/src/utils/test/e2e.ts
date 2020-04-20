/* eslint-disable no-console */
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

import { getConfig } from "../../config";

export function launchBrowser(slowMo = 0, install = true): Promise<Browser> {
  const CRX_PATH = require("path").join(__dirname, "../../../../sanes-browser-extension/build");
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
  await page.goto("http://localhost:9000/", {
    waitUntil: "networkidle2",
  });
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  await page.bringToFront();

  return page;
}

export async function createExtensionPage(browser: Browser): Promise<Page> {
  const config = await getConfig();

  const page: Page = await browser.newPage();
  await page.goto(`chrome-extension://${config.extensionId}/index.html`, {
    waitUntil: "networkidle2",
  });
  page.on("console", msg => console.log("EXTENSION PAGE LOG:", msg.text()));
  await page.bringToFront();

  return page;
}

export async function getBackgroundPage(browser: Browser): Promise<Page> {
  const config = await getConfig();

  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    target => target.type() === "background_page" && target.url().includes(config.extensionId),
  );
  if (!backgroundPageTarget) {
    throw new Error("Unable to find extension background page");
  }
  const page = await backgroundPageTarget.page();
  page.on("console", msg => console.log("BACKGROUND PAGE LOG:", msg.text()));
  return page;
}

export function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}

export async function closeToast(page: Page): Promise<void> {
  return page.click('[aria-label="Close"]');
}

export async function getToastMessage(page: Page): Promise<string> {
  const toastTextElement = await page.$("#toast-provider h6");
  if (!toastTextElement) throw new Error("h6 element not found");

  return (await (await toastTextElement.getProperty("textContent")).jsonValue()) as string;
}

export async function getElements(page: Page, dataTestTag: string): Promise<ElementHandle<Element>[]> {
  const selector = `[data-test=${dataTestTag}]`;
  const elements = await page.$$(selector);

  return elements;
}

export async function waitForView(page: Page, dataTestTag: string): Promise<void> {
  try {
    await getElements(page, dataTestTag);
  } catch {
    throw Error(`Could not reach view: ${dataTestTag}`);
  }
}
