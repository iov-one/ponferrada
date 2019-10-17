import { ElementHandle, Page } from "puppeteer";
import { whenTrue } from "ui-logic";

const mainMenuH6Elements = 3;
const nonBalanceH6Elements = mainMenuH6Elements + 1 /* Hi! menu */ + 1 /* Your currencies */;
const numberOfTokensFromFaucet = 4;

export const getNoFundsMessage = (h6Elements: Element[]): string => {
  const index = mainMenuH6Elements + 1;
  return h6Elements[index].textContent || "";
};

export const getIovUsername = (h5Elements: Element[]): string => {
  return h5Elements[0].textContent || "";
};

export const getBalanceTextAtIndex = async (
  h6Elements: ElementHandle<Element>[],
  index: number,
): Promise<string> => {
  const property = await h6Elements[nonBalanceH6Elements + index].getProperty("textContent");
  return (await property.jsonValue()) || "";
};

export function waitForAllBalances(page: Page): Promise<void> {
  return whenTrue(async () => {
    return (await page.$$("h6")).length >= nonBalanceH6Elements + numberOfTokensFromFaucet;
  }, 20000);
}

export const getUsernameE2E = async (h5Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h5Elements[0].getProperty("textContent")).jsonValue()) || "";
};

export const waitForUsername = async (h5Elements: ElementHandle<Element>[]): Promise<void> =>
  whenTrue(async () => (await getUsernameE2E(h5Elements)).match(/\*iov$/) !== null, 20000);
