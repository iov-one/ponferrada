import { Page } from "puppeteer";

import { whenOnNavigatedToE2eRoute } from "../../../utils/test/navigation";
import { RECEIVE_ROUTE } from "../../paths";

export async function travelToReceivePaymentE2E(page: Page): Promise<void> {
  await page.click(`#${RECEIVE_ROUTE.replace("/", "\\/")}`);
  await whenOnNavigatedToE2eRoute(page, RECEIVE_ROUTE);
}
