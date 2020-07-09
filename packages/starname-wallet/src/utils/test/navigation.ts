import { Page } from "puppeteer";
import { whenTrue } from "ui-logic";

export const whenOnNavigatedToRoute = (desiredRoute: string): Promise<void> =>
  whenTrue(() => window.location.pathname === desiredRoute);

export const whenOnNavigatedToE2eRoute = (page: Page, desiredRoute: string): Promise<void> =>
  whenTrue(() => page.url().endsWith(desiredRoute));
