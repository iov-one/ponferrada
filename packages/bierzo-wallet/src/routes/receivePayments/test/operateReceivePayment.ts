import { Page } from 'puppeteer';

export async function getAddressRow(page: Page, dataIndex: number): Promise<string> {
  const element = await page.$(`li:nth-of-type(${dataIndex}) p`);
  if (element === null) {
    throw new Error(`LI element with index: ${dataIndex} not found.`);
  }

  return await (await element.getProperty('textContent')).jsonValue();
}
