import { ElementHandle } from 'puppeteer';

export const getNoFundsMessage = (h6Elements: Element[]): string => {
  return h6Elements[4].textContent || '';
};

export const getIOVUsername = (h5Elements: Element[]): string => {
  return h5Elements[0].textContent || '';
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

export const getUsernameE2E = async (h5Elements: ElementHandle<Element>[]): Promise<string> => {
  return (await (await h5Elements[0].getProperty('textContent')).jsonValue()) || '';
};
