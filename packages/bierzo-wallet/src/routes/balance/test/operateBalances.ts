import { ElementHandle } from 'puppeteer';

const NO_FUNDS_IDX = 4;
export const getNoFundsMessage = (h6Elements: Element[]): string => {
  return h6Elements[NO_FUNDS_IDX].textContent || '';
};

export const getFirstCurrencyBalanceE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h6Elements[5].getProperty('textContent')).jsonValue()) || '';
};

export const getSecondCurrencyBalanceE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h6Elements[6].getProperty('textContent')).jsonValue()) || '';
};

export const getThirdCurrencyBalanceE2E = async (h6Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h6Elements[7].getProperty('textContent')).jsonValue()) || '';
};
