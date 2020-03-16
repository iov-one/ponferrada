import { ElementHandle, Page } from "puppeteer";

import { iovnamesViewId } from "../components/Iovnames";

export async function getAddressRow(page: Page, dataIndex: number): Promise<readonly string[]> {
  const chainNameEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(1)`);
  if (chainNameEl === null) {
    throw new Error(`TD element containig chain name with row index: ${dataIndex} not found.`);
  }

  const addressEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(2)`);
  if (addressEl === null) {
    throw new Error(`TD element containig address with row index: ${dataIndex} not found.`);
  }

  const chainName = (await (await chainNameEl.getProperty("textContent")).jsonValue()) as string;
  const address = (await (await addressEl.getProperty("textContent")).jsonValue()) as string;

  return [chainName, address];
}

export async function copyAddress(page: Page, dataIndex: number): Promise<string> {
  const addressEl = await page.$(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(2)`);
  if (addressEl === null) {
    throw new Error(`TD element containig address with row index: ${dataIndex} not found.`);
  }

  await page.click(`tbody tr:nth-of-type(${dataIndex}) td:nth-of-type(3)`);

  return (await (await addressEl.getProperty("textContent")).jsonValue()) as string;
}

export async function copyStarname(page: Page): Promise<void> {
  const starnameEl = await page.$(`#${iovnamesViewId} h4`);
  if (starnameEl === null) {
    throw new Error(`Starname element was not found.`);
  }

  await page.click(`#${iovnamesViewId} img`);
}

export async function getStarnames(page: Page): Promise<string[]> {
  const starnameEls = await page.$$("h4");
  const names: string[] = [];
  for (const el of starnameEls) {
    names.push((await (await el.getProperty("textContent")).jsonValue()) as string);
  }

  return names;
}

export async function getRemoveActions(page: Page): Promise<ElementHandle<Element>[]> {
  return await page.$x(`//p[contains(., 'Remove')]`);
}

export async function getLinkedAddresses(page: Page): Promise<string[]> {
  const addressesRows = await page.$$("tr");
  const addresses: string[] = [];
  for (const el of addressesRows) {
    addresses.push((await (await el.getProperty("textContent")).jsonValue()) as string);
  }

  addresses.splice(0, 1);
  return addresses;
}
