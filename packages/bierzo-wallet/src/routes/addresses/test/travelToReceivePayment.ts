import { Page } from "puppeteer";

import { manageIovnameId, manageStarnameId } from "../../../components/AccountManage";
import { ADDRESSES_TEXT } from "../../../components/Header/components/LinksMenu";
import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { ADDRESSES_ROUTE } from "../../paths";
import { yourAddresses, yourIovnames, yourStarnames } from "../components/AddressesTab";
import { iovnamesViewId } from "../components/Iovnames";
import { starnamesViewId } from "../components/Starnames";
import { yourBlockchainAddressesId } from "../components/UserAddresses";

export async function travelToAddressesE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${ADDRESSES_TEXT}')]`);
  await addressesLink.click();
  await whenOnNavigatedToE2eRoute(page, ADDRESSES_ROUTE);
}

export async function travelToBlockchainAddressesTabE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${yourAddresses}')]`);
  await addressesLink.click();
  await page.waitForSelector(`#${yourBlockchainAddressesId}`);
}

export async function travelToIovnamesTabE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${yourIovnames}')]`);
  await addressesLink.click();
  await page.waitForSelector(`#${iovnamesViewId}`);
}

export async function travelToStarnamesTabE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${yourStarnames}')]`);
  await addressesLink.click();
  await page.waitForSelector(`#${starnamesViewId}`);
}

export async function manageFirstIovnameE2E(page: Page): Promise<void> {
  const [firstStarnameEditLink] = await page.$x(`//h6[contains(., 'Manage')]`);
  await firstStarnameEditLink.click();
  await page.waitForSelector(`#${manageIovnameId}`);
}

export async function manageFirstStarnameE2E(page: Page): Promise<void> {
  const [firstStarnameEditLink] = await page.$x(`//h6[contains(., 'Manage')]`);
  await firstStarnameEditLink.click();
  await page.waitForSelector(`#${manageStarnameId}`);
  expect(page.url().endsWith("/starname/manage")).toBe(true);
}

export async function manageFirstNameE2E(page: Page): Promise<void> {
  const firstNameEditLink = (await page.$x(`//h6[contains(., 'Manage')]`))[1];
  await firstNameEditLink.click();
  await page.waitForSelector(`#${manageStarnameId}`);
  expect(page.url().endsWith("/name/manage")).toBe(true);
}
