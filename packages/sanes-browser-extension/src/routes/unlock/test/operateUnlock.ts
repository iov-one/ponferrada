import TestUtils from "react-dom/test-utils";

export const getPasswordValidity = (unlockDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(unlockDom, "p")[1];
};

export const isButtonDisabled = (continueButton: Element): boolean => {
  return continueButton.classList.contains("Mui-disabled");
};
