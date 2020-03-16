import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";

export const getAccountDropDown = (accountStatusDom: React.Component): Element[] => {
  return TestUtils.scryRenderedDOMComponentsWithClass(accountStatusDom, "MuiList-padding");
};

export const checkCreateAccount = (accountStatusDom: React.Component): void => {
  const accountDropdown = getAccountDropDown(accountStatusDom);
  expect(accountDropdown.length).toBe(2);
  const createNewAccount = accountDropdown[0];

  const createAccountElem = createNewAccount.children[0].children[0].children[0];
  expect(createAccountElem.textContent).toBe("Create a new one");
};

export const getBalanceTokensCount = (accountStatusDom: React.Component): number => {
  // Total number of List component rows minus header row.
  return TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, "li").length - 1;
};

export async function getBalanceAmount(page: Page): Promise<string> {
  const balanceAmountElement = await page.$("h5");
  if (!balanceAmountElement) throw new Error("h5 element not found");

  return (await (await balanceAmountElement.getProperty("textContent")).jsonValue()) as string;
}
