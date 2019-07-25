import TestUtils from 'react-dom/test-utils';

export const getCancelButton = (paymentDom: React.Component): Element => {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(paymentDom, 'button');
  return buttons[2];
};

export const getSelectedCurrency = (inputs: Element[]): string => {
  const input = inputs[1] as HTMLInputElement;
  return input.value;
};
