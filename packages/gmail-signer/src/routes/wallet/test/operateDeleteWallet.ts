import TestUtils from "react-dom/test-utils";

export const getMnemonicValidity = (unlockDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(unlockDom, "p")[8];
};

export const isButtonDisabled = (continueButton: Element): boolean => {
  return continueButton.classList.contains("Mui-disabled");
};
