import TestUtils from "react-dom/test-utils";

export const getRenderedMnemonic = (recoveryWordsDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(recoveryWordsDom, "p")[1];
};
