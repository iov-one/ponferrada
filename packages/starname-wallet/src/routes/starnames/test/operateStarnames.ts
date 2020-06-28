import { Page } from "puppeteer";

import { STARNAMES_VIEW_ID } from "..";
import { manageStarnameId } from "../../../components/AccountManage";
import { STARNAMES_TAB_TITLE } from "../../../components/Header/components/LinksMenu";

export async function travelToStarnamesTabE2E(page: Page): Promise<void> {
  const [addressesLink] = await page.$x(`//h6[contains(., '${STARNAMES_TAB_TITLE}')]`);
  await addressesLink.click();
  await page.waitForSelector(`#${STARNAMES_VIEW_ID}`);
}

export async function getStarnames(page: Page): Promise<string[]> {
  const starnameEls = (await page.$$("h5")).slice(1);
  const names: string[] = [];
  for (const el of starnameEls) {
    names.push((await (await el.getProperty("textContent")).jsonValue()) as string);
  }

  return names;
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

// Expects an expirty date label with the format: Expires on 4/15/2020 8:43:10 AM
export function parseExpiryDateLocaleEnUs(expiryLabel: string): Date {
  const [, , dateString, ...timeArray] = expiryLabel.split(" ");
  const timeString = timeArray.join(" ");

  return new Date(`${dateString} ${timeString}`);
}
