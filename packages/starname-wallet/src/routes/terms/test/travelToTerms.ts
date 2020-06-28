import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { MENU_ID, TERMS_CONDITIONS_ID } from "../../../components/Header/components/HiMenu";
import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { travelToBalanceE2E } from "../../balance/test/travelToBalance";
import { TERMS_ROUTE } from "../../paths";

export async function travelToTermsE2E(browser: Browser, page: Page): Promise<void> {
  await travelToBalanceE2E(browser, page);
  await page.click(`#${MENU_ID.replace("/", "\\/")}`);
  await sleep(500);
  await page.click(`#${TERMS_CONDITIONS_ID.replace("/", "\\/")}`);
  await whenOnNavigatedToE2eRoute(page, TERMS_ROUTE);
}
