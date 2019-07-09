import { Store } from 'redux';

import { BALANCE_ROUTE, HOME_ROUTE, LOGIN_ROUTE, SET_NAME_ROUTE, SIGNUP_ROUTE } from '~/routes';
import { processSetName } from '~/routes/signupName/test/utils/travelSetName';
import { processSignup } from '~/routes/signupPass/test/utils/travelSignup';
import { history } from '~/store';
import { createDom, expectRoute } from '~/utils/test/dom';
import { sleep } from '~/utils/timer';

export const processBalance = async (store: Store, account: string): Promise<React.Component> => {
  const HomeDom = await travelToHome(store);
  expectRoute(store, LOGIN_ROUTE);
  history.push(SIGNUP_ROUTE);

  const SignupDom = HomeDom;
  expectRoute(store, SIGNUP_ROUTE);
  await processSignup(SignupDom, store);
  expectRoute(store, SET_NAME_ROUTE);

  const SetNameDom = SignupDom;
  await processSetName(SetNameDom, account, store);

  expectRoute(store, BALANCE_ROUTE);
  const BalanceDom = SetNameDom;

  return BalanceDom;
};

export const travelToBalance = async (store: Store): Promise<React.Component> => {
  history.push(BALANCE_ROUTE);

  const dom = createDom(store);
  await sleep(500);

  return dom;
};

const travelToHome = async (store: Store): Promise<React.Component> => {
  history.push(HOME_ROUTE);

  const dom = createDom(store);
  await sleep(500);
  return dom;
};
