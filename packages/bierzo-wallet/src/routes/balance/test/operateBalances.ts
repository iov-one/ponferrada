import { ElementHandle } from 'puppeteer';

const NO_FUNDS_IDX = 4;
export const getNoFundsMessage = (h6Elements: Element[]): string => {
  return h6Elements[NO_FUNDS_IDX].textContent || '';
};

export const getNoFundsMessageE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h6Elements[NO_FUNDS_IDX].getProperty('textContent')).jsonValue()) || '';
};
