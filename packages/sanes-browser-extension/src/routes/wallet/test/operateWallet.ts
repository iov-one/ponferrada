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

export const getTransactionsCount = (accountStatusDom: React.Component): number => {
  // Total number of List component rows minus header row.
  return TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, "li").length - 1;
};
