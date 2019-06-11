import { Store } from 'redux';
import { mayTestBns, randomString } from '~/logic/testhelpers';
import { RootState } from '~/reducers';
import { LOGIN_ROUTE, PRIVACY_POLICY_ROUTE, TERMS_OF_SERVICE_ROUTE } from '~/routes';
import { processBalance, travelToBalance } from '~/routes/balance/test/util/travelBalance';
import { shutdownSequence } from '~/sequences/boot';
import { aNewStore } from '~/store';
import { sleep } from '~/utils/timer';
import { LOG_OUT_ID, PRIVACY_POLICY_ID, TERMS_CONDITIONS_ID } from '../HiMenu/index';
import { clickMenuAndRedirect } from './util/menu';

describe('Components -> Header -> HiMenu', () => {
  let store: Store<RootState>;

  beforeEach(async () => {
    store = aNewStore();
    const account = randomString(6);
    await processBalance(store, account);
  }, 25000);

  afterEach(() => {
    shutdownSequence(null, store.getState);
  });

  mayTestBns(
    `should redirect to approprite route when clicking on it`,
    async () => {
      const BalanceDom = await travelToBalance(store);

      await clickMenuAndRedirect(BalanceDom, TERMS_CONDITIONS_ID, TERMS_OF_SERVICE_ROUTE, store);
      await clickMenuAndRedirect(BalanceDom, PRIVACY_POLICY_ID, PRIVACY_POLICY_ROUTE, store);

      /**
       * This should be run at the end of all checks. Because this will logout current user from
       * the wallet and all other menu checks will be failed.
       */
      await clickMenuAndRedirect(BalanceDom, LOG_OUT_ID, LOGIN_ROUTE, store);
      const newStore = aNewStore();
      await sleep(1500);
      expect(store.getState()).toEqual(newStore.getState());
    },
    16000,
  );
});
