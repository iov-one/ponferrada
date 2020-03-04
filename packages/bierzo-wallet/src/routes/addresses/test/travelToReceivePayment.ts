import { Page } from "puppeteer";

import { ADDRESSES_TEXT } from "../../../components/Header/components/LinksMenu";
import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { ADDRESSES_ROUTE } from "../../paths";
import { REGISTER_IOVNAME_VIEW_ID } from "../../register/components/IovnameForm";
import { yourAddresses, yourIovnames } from "../components/AddressesTab";
import { iovnamesViewId } from "../components/Iovnames";
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

export async function travelToStarnamesTabE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${yourIovnames}')]`);
  await addressesLink.click();
  await page.waitForSelector(`#${iovnamesViewId}`);
}

export async function openFirstStarnameForEditingE2E(page: Page, username: string): Promise<void> {
  const [firstStarnameEditLink] = await page.$x(`//h6[contains(., 'Edit')]`);
  await firstStarnameEditLink.click();
  await page.waitForSelector(`#${REGISTER_IOVNAME_VIEW_ID}`);
}
