import { ElementHandle } from 'puppeteer';

export const getNoFundsMessage = (h6Elements: Element[]): string => {
  return h6Elements[4].textContent || '';
};

export const getIovUsername = (h5Elements: Element[]): string => {
  return h5Elements[0].textContent || '';
};

export const getBalanceTextAtIndex = async (
  h6Elements: ElementHandle<Element>[],
  index: number,
): Promise<string> => {
  const property = await h6Elements[5 + index].getProperty('textContent');
  return (await property.jsonValue()) || '';
};

export const getUsernameE2E = async (h5Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h5Elements[0].getProperty('textContent')).jsonValue()) || '';
};
