import { Browser, Page } from "puppeteer";
import { sleep } from "ui-logic";

import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { travelFromLoginToUpgradeE2E } from "../../balance/test/travelToBalance";
import { UPGRADE_ROUTE } from "../../paths";

export async function travelToUpgradeE2E(browser: Browser, page: Page): Promise<void> {
  await travelFromLoginToUpgradeE2E(browser, page);
  await sleep(500);
  await whenOnNavigatedToE2eRoute(page, UPGRADE_ROUTE);
}
