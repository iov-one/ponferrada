import TestUtils from "react-dom/test-utils";

export const getRequests = (requestsDom: React.Component): Element[] => {
  return TestUtils.scryRenderedDOMComponentsWithTag(requestsDom, "li");
};

export const getFirstRequest = (requestsDom: React.Component): Element => {
  return getRequests(requestsDom)[0];
};
