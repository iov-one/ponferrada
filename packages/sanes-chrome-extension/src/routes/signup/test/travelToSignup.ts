import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { findRenderedE2EComponentWithId } from '../../../utils/test/reactElemFinder';
import { SIGNUP_ROUTE } from '../../paths';
import { FIRST_STEP_SIGNUP_ROUTE } from '../components/NewAccountForm';

export const travelToSignup = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(SIGNUP_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(store, SIGNUP_ROUTE);

  return dom;
};

export const travelToSignupNewAccountStep = async (page: Page): Promise<void> => {
  await page.click('button:nth-of-type(2)');

  await findRenderedE2EComponentWithId(page, FIRST_STEP_SIGNUP_ROUTE);
};
