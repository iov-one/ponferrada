import { findRenderedE2EComponentWithId } from '../../../utils/test/reactElemFinder';
import { Page } from 'puppeteer';
import { ACCOUNT_STATUS_ROUTE } from '../../paths';
import { PASSWORD_FIELD } from '../components/LoginForm';

export const submitLoginForm = async (page: Page, password: string): Promise<void> => {
  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);

  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, ACCOUNT_STATUS_ROUTE);
};
