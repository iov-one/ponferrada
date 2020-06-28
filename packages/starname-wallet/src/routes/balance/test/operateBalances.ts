import { Browser, ElementHandle, Page } from "puppeteer";
import { randomString, sleep, whenTrue } from "ui-logic";

import { acceptEnqueuedRequest } from "../../../utils/test/persona";
import { REGISTER_IOVNAME_FIELD } from "../../account/register/components/IovnameForm";
import { REGISTER_NAME_FIELD, REGISTER_NAME_VIEW_ID } from "../../account/register/components/NameForm";
import { REGISTER_STARNAME_FIELD } from "../../account/register/components/StarnameForm";
import { REGISTER_IOVNAME_LINK } from "../../iovnames";
import { REGISTER_STARNAME_LINK } from "../../starnames";

const mainMenuH6Elements = 3;
const numberOfTokensFromFaucet = 4;

export const getNoFundsMessage = (h6Elements: Element[]): string => {
  // NOTE disabled "starnames" tab +1 or -1
  const index = mainMenuH6Elements + 6;
  // const index = mainMenuH6Elements + 5;
  return h6Elements[index].textContent || "";
};

export const getIovUsername = (h6Elements: Element[]): string => {
  // NOTE disabled "starnames" tab +1 or -1
  const index = mainMenuH6Elements + 4;
  return h6Elements[index].textContent || "";
};

export const getLedgerUsernameWarning = (pElements: Element[]): string => {
  return pElements[0].textContent || "";
};

export const getBalanceTextAtIndex = async (
  h5Elements: ElementHandle<Element>[],
  index: number,
): Promise<string> => {
  const property = await h5Elements[index].getProperty("textContent");
  return ((await property.jsonValue()) as string) || "";
};

export function waitForAllBalances(page: Page): Promise<void> {
  return whenTrue(async () => {
    return (await page.$$("h5")).length >= numberOfTokensFromFaucet;
  }, 20000);
}

export const getAddressCreationPromptE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  // NOTE: disabled "starnames" tab
  const index = mainMenuH6Elements + 4;
  // const index = mainMenuH6Elements + 3;
  return ((await (await h6Elements[index].getProperty("textContent")).jsonValue()) as string) || "";
};

export const registerIovname = async (browser: Browser, page: Page): Promise<string> => {
  await page.click(`#${REGISTER_IOVNAME_LINK}`);

  // Fill the form
  await sleep(1000);
  const iovname = `${randomString(10)}*iov`;
  await page.type(`input[name="${REGISTER_IOVNAME_FIELD}"]`, iovname);
  await page.click('button[type="submit"]');

  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();

  return iovname;
};

export const registerIovnameWithoutStarname = async (browser: Browser, page: Page): Promise<string> => {
  await page.click(`#${REGISTER_IOVNAME_LINK}`);

  // Fill the form
  await sleep(1000);
  const iovname = `${randomString(10)}*iov`;
  await page.type(`input[name="${REGISTER_IOVNAME_FIELD}"]`, iovname);
  await page.click("#remove-11"); // remove starname address for now
  await page.click('button[type="submit"]');

  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();

  return iovname;
};

export const registerStarname = async (browser: Browser, page: Page): Promise<string> => {
  await page.click(`#${REGISTER_STARNAME_LINK}`);

  // Fill the form
  await sleep(1000);
  const starname = `*${randomString(10)}`;
  await page.type(`input[name="${REGISTER_STARNAME_FIELD}"]`, starname);
  await page.click('button[type="submit"]');

  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();

  return starname;
};

export const registerName = async (browser: Browser, page: Page): Promise<string> => {
  const starname = (await (await (await page.$$("h4"))[0].getProperty("textContent")).jsonValue()) as string;

  const [createNewNameLink] = await page.$x(`//h6[contains(., '+ Create a new name')]`);
  await sleep(10000);
  createNewNameLink.click();
  await page.waitForSelector(`#${REGISTER_NAME_VIEW_ID}`);

  // Fill the form
  await sleep(1000);
  const name = `${randomString(10)}${starname}`;
  await page.type(`input[name="${REGISTER_NAME_FIELD}"]`, name);
  await page.click('button[type="submit"]');

  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();

  return name;
};
