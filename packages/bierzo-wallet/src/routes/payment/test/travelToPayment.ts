import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../../../routes";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToE2eRoute, whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { PAYMENT_ROUTE } from "../../paths";

export const travelToPayment = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act((): void => {
    history.push(PAYMENT_ROUTE);
  });
  await whenOnNavigatedToRoute(PAYMENT_ROUTE);

  return dom;
};

export async function travelToPaymentE2E(page: Page): Promise<void> {
  await page.click(`#${PAYMENT_ROUTE.replace("/", "\\/")}`);
  await whenOnNavigatedToE2eRoute(page, PAYMENT_ROUTE);
}
