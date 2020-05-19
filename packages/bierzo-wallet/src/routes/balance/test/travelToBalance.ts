import { Browser, Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";
import { Store } from "redux";
import { sleep } from "ui-logic";

import { history } from "../../../routes";
import { createDom } from "../../../utils/test/dom";
import { createExtensionPage, getBackgroundPage } from "../../../utils/test/e2e";
import { whenOnNavigatedToE2eRoute, whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { acceptEnqueuedRequest, submitExtensionCreateWalletForm } from "../../../utils/test/persona";
import { BALANCE_ROUTE } from "../../paths";
import { GO_TO_BALANCE_LINK } from "../../upgrade";

export const travelToBalance = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act((): void => {
    history.push(BALANCE_ROUTE);
  });
  await whenOnNavigatedToRoute(BALANCE_ROUTE);

  return dom;
};

export async function travelToBalanceE2E(browser: Browser, page: Page): Promise<void> {
  await getBackgroundPage(browser);
  const extensionPage = await createExtensionPage(browser);
  await submitExtensionCreateWalletForm(extensionPage, "12345678");
  await extensionPage.close();
  await page.bringToFront();
  // Click on login button
  await page.click("button");
  await sleep(1000);
  await acceptEnqueuedRequest(browser);
  await page.bringToFront();
  await sleep(500);
  await page.click(`#${GO_TO_BALANCE_LINK.replace("/", "\\/")}`);
  await whenOnNavigatedToE2eRoute(page, BALANCE_ROUTE);
}
