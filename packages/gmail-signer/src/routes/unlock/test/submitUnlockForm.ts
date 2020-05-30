import { Page } from "puppeteer";

import { findRenderedE2EComponentWithId } from "../../../utils/test/reactElemFinder";
import { WALLET_STATUS_ROUTE } from "../../paths";
import { PASSWORD_FIELD } from "../components/UnlockForm";

export const submitE2EUnlockForm = async (page: Page, password: string): Promise<void> => {
  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);

  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, WALLET_STATUS_ROUTE);
};
