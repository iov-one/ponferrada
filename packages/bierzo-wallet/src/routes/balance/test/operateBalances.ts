import { Browser, ElementHandle, Page } from "puppeteer";
import { randomString, sleep, whenTrue } from "ui-logic";

import { acceptEnqueuedRequest } from "../../../utils/test/persona";
import { registerIovnameId } from "../../addresses/components/IovnamesNotExists";
import { REGISTER_IOVNAME_FIELD } from "../../register/components/IovnameForm";

const mainMenuH6Elements = 3;
const numberOfTokensFromFaucet = 4;

export const getNoFundsMessage = (h6Elements: Element[]): string => {
  const index = mainMenuH6Elements + 4;
  return h6Elements[index].textContent || "";
};

export const getIovUsername = (h6Elements: Element[]): string => {
  const index = mainMenuH6Elements + 2;
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
  return (await property.jsonValue()) || "";
};

export function waitForAllBalances(page: Page): Promise<void> {
  return whenTrue(async () => {
    return (await page.$$("h5")).length >= numberOfTokensFromFaucet;
  }, 20000);
}

export const getAddressCreationPromptE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  const index = mainMenuH6Elements + 2;
  return (await (await h6Elements[index].getProperty("textContent")).jsonValue()) || "";
};

export const registerPersonalizedAddress = async (browser: Browser, page: Page): Promise<string> => {
  await page.click(`#${registerIovnameId}`);

  // Fill the form
  await sleep(1000);
  const username = `${randomString(10)}*iov`;
  await page.type(`input[name="${REGISTER_IOVNAME_FIELD}"]`, username);
  await page.click('button[type="submit"]');

  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(1000);
  const buttons = await page.$$("button");
  await buttons[1].click();

  return username;
};
