import TestUtils from "react-dom/test-utils";

export const getRequests = (requestsDom: React.Component): Element[] => {
  const liElements = TestUtils.scryRenderedDOMComponentsWithTag(requestsDom, "li");
  return liElements.slice(4);
};

export const getFirstRequest = (requestsDom: React.Component): Element => {
  return getRequests(requestsDom)[0];
};
