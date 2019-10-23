import { ElementHandle, Page } from "puppeteer";
import { whenTrue } from "ui-logic";

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
