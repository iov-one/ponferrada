import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { history } from '../..';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { DASHBOARD_ROUTE } from '../../paths';

export const travelToDashboard = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(DASHBOARD_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(DASHBOARD_ROUTE);

  return dom;
};

export const travelToDashboardE2e = async (page: Page): Promise<void> => {
  await page.click('button');
};
