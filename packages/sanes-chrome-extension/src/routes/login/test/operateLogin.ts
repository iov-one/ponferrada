import TestUtils from 'react-dom/test-utils';

export const getPasswordValidity = (loginDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'p')[1];
};

export const isButtonDisabled = (continueButton: Element): boolean => {
  return continueButton.classList.contains('Mui-disabled');
};
