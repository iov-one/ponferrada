import { Page } from "puppeteer";

import { starnamesViewId } from "../components/Starnames";

export async function getAddressRow(page: Page, dataIndex: number): Promise<readonly string[]> {
  const chainNameEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(1)`);
  if (chainNameEl === null) {
    throw new Error(`TD element containig chain name with row index: ${dataIndex} not found.`);
  }

  const addressEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(2)`);
  if (addressEl === null) {
    throw new Error(`TD element containig address with row index: ${dataIndex} not found.`);
  }

  const chainName = await (await chainNameEl.getProperty("textContent")).jsonValue();
  const address = await (await addressEl.getProperty("textContent")).jsonValue();

  return [chainName, address];
}

export async function copyAddress(page: Page, dataIndex: number): Promise<string> {
  const addressEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(2)`);
  if (addressEl === null) {
    throw new Error(`TD element containig address with row index: ${dataIndex} not found.`);
  }

  await page.click(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(3)`);

  return await (await addressEl.getProperty("textContent")).jsonValue();
}

export async function copyStarname(page: Page): Promise<void> {
  const starnameEl = await page.$(`#${starnamesViewId} h4`);
  if (starnameEl === null) {
    throw new Error(`Starname element was not found.`);
  }

  await page.click(`#${starnamesViewId} img`);
}
