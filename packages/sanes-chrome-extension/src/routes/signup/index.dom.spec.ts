import { Store } from 'redux';
import { PersonaData } from '../../extension/background/model/backgroundscript';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import * as chromeInternalMsgs from '../../utils/chrome';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { mayTestChains } from '../../utils/test/testExecutor';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import { processSignUp } from './test/travelToSignup';

describe('DOM > Feature > Signup', (): void => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();

    const response: PersonaData = {
      accounts: [],
      mnemonic: 'badge cattle stool execute involve main mirror envelope brave scrap involve simple',
      txs: [],
    };
    jest.spyOn(chromeInternalMsgs, 'createPersona').mockResolvedValueOnce(response);
  });

  mayTestChains(
    `should finish the signup three steps process`,
    async (): Promise<void> => {
      await processSignUp(store);
      await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
    },
    55000,
  );
});
