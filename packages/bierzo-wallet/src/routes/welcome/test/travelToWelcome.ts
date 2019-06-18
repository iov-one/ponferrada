import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { history } from '../../../routes';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { WELCOME_ROUTE } from '../../paths';

export const travelToWelcome = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(WELCOME_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(WELCOME_ROUTE);

  return dom;
};

export const travelToWelcomeE2e = async (page: Page): Promise<void> => {
  await page.click('button');
};
