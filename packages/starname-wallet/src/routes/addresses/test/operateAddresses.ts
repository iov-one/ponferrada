import { Page } from "puppeteer";

import { ADDRESSES_TAB_TITLE } from "../../../components/Header/components/LinksMenu";
import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { ADDRESSES_ROUTE } from "../../paths";

export async function travelToAddressesE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${ADDRESSES_TAB_TITLE}')]`);
  await addressesLink.click();
  await whenOnNavigatedToE2eRoute(page, ADDRESSES_ROUTE);
}

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
