import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RESTORE_ACCOUNT, LOGIN_ROUTE } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { Page } from 'puppeteer';
import { findRenderedE2EComponentWithId } from '../../../utils/test/reactElemFinder';

export const travelToRestoreAccount = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(RESTORE_ACCOUNT);
    }
  );
  await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);

  return dom;
};

export const travelToRestoreAccountStep = async (page: Page): Promise<void> => {
  await page.click('button:nth-of-type(1)');
  await findRenderedE2EComponentWithId(page, LOGIN_ROUTE);

  await page.click('a:nth-of-type(1)');
  await findRenderedE2EComponentWithId(page, RESTORE_ACCOUNT);
};
