import puppeteer, { Browser, Page } from "puppeteer";

import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from "../../theme/constants";

export const EXTENSION_ID = "dafekhlcpidfaopcimocbcpciholgkkb";

export function launchBrowser(slowMo = 0): Promise<Browser> {
  const CRX_PATH = require("path").join(__dirname, "../../../build");
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
  await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`, {
    waitUntil: "networkidle2",
  });
  // eslint-disable-next-line no-console
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  await page.bringToFront();

  return page;
}

export async function getBackgroundPage(browser: Browser): Promise<Page> {
  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    target => target.type() === "background_page" && target.url().includes(EXTENSION_ID),
  );
  if (!backgroundPageTarget) {
    throw new Error("Unable to find extension background page");
  }
  const page = await backgroundPageTarget.page();
  // eslint-disable-next-line no-console
  page.on("console", msg => console.log("BACKGROUND PAGE LOG:", msg.text()));
  return page;
}

export function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}
