import { Browser, Page } from "puppeteer";

import { travelToBalanceE2E } from "../../balance/test/travelToBalance";
import { UPGRADE_ROUTE } from "../../paths";

export async function travelToUpgradeE2E(browser: Browser, page: Page): Promise<void> {
  await travelToBalanceE2E(browser, page);
  await page.goto("http://localhost:9000" + UPGRADE_ROUTE);
}
