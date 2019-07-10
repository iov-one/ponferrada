/*import { Store } from 'redux';

import { mayTestBns, randomString } from '~/logic/testhelpers';
import { RootState } from '~/reducers';
import { BALANCE_ROUTE } from '~/routes';
import { shutdownSequence } from '~/sequences/boot';
import { aNewStore } from '~/store';

import { processBalance } from './util/travelBalance';

describe('DOM > Feature > Balance', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  afterEach(() => {
    shutdownSequence(null, store.getState);
  });

  mayTestBns(
    `should redirect to ${BALANCE_ROUTE} route after signing up`,
    async () => {
      const account = randomString(6);
      await processBalance(store, account);
    },
    55000,
  );
});*/
