import { Page } from "puppeteer";
import { Component } from "react";
import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../..";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import {
  DASHBOARD_ACTIVE_ROUTE,
  DASHBOARD_AUTHORED_ROUTE,
  DASHBOARD_ENDED_ROUTE,
  DASHBOARD_ROUTE,
} from "../../paths";

const travelTo = async (route: string, store: Store): Promise<Component> => {
  let dom: Component = new Component({});

  await TestUtils.act((async () => {
    dom = createDom(store);
    history.push(route);
    await whenOnNavigatedToRoute(route);
  }) as () => void);

  return dom;
};

export const travelToDashboard = async (store: Store): Promise<Component> => travelTo(DASHBOARD_ROUTE, store);

export const travelToDashboardActive = async (store: Store): Promise<Component> =>
  travelTo(DASHBOARD_ACTIVE_ROUTE, store);

export const travelToDashboardAuthored = async (store: Store): Promise<Component> =>
  travelTo(DASHBOARD_AUTHORED_ROUTE, store);

export const travelToDashboardEnded = async (store: Store): Promise<Component> =>
  travelTo(DASHBOARD_ENDED_ROUTE, store);

export const travelToDashboardE2e = async (page: Page): Promise<void> => {
  await page.click("button");
};
