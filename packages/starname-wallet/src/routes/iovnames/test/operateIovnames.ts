import { Page } from "puppeteer";

import { IOVNAMES_VIEW_ID } from "..";
import { manageIovnameId } from "../../../components/AccountManage";
import { IOVNAMES_TAB_TITLE } from "../../../components/Header/components/LinksMenu";

export async function travelToIovnamesTabE2E(page: Page): Promise<void> {
  // const [addressesLink] = await page.$x(`//h6[contains(., '${IOVNAMES_TAB_TITLE}')]`);
  const addressesLink = await page.waitForSelector(`#${IOVNAMES_TAB_TITLE}`);
  await addressesLink.click();
  await page.waitForSelector(`#${IOVNAMES_VIEW_ID}`);
}

export async function getIovnames(page: Page): Promise<string[]> {
  const iovnameEls = (await page.$$("h5")).slice(1);
  const names: string[] = [];
  for (const el of iovnameEls) {
    names.push((await (await el.getProperty("textContent")).jsonValue()) as string);
  }

  return names;
}

export async function manageFirstIovnameE2E(page: Page): Promise<void> {
  const [firstStarnameEditLink] = await page.$x(`//h6[contains(., 'Manage')]`);
  await firstStarnameEditLink.click();
  await page.waitForSelector(`#${manageIovnameId}`);
}
