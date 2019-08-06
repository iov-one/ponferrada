import { Page } from "puppeteer";

import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { ADDRESSES_ROUTE } from "../../paths";

export async function travelToAddressesE2E(page: Page): Promise<void> {
  await page.click(`#${ADDRESSES_ROUTE.replace("/", "\\/")}`);
  await whenOnNavigatedToE2eRoute(page, ADDRESSES_ROUTE);
}
