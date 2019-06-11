import TestUtils from 'react-dom/test-utils';

export const getDropdown = (accountStatusDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithClass(accountStatusDom, 'MuiList-padding')[1];
};
