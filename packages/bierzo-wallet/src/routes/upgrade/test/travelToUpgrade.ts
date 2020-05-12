import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { MENU_ID, TERMS_CONDITIONS_ID } from "../../../components/Header/components/HiMenu";
import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { travelToBalanceE2E } from "../../balance/test/travelToBalance";
import { UPGRADE_ROUTE } from "../../paths";

export async function travelToUpgradeE2E(browser: Browser, page: Page): Promise<void> {
  await travelToBalanceE2E(browser, page);
  await page.goto("http://localhost:9000" + UPGRADE_ROUTE);
}
