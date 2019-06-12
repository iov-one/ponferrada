import TestUtils from 'react-dom/test-utils';

export const getRenderedMnemonic = (recoveryPhraseDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(recoveryPhraseDom, 'p')[1];
};
