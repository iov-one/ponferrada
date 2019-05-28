import { Store } from 'redux';
import { PersonaData } from '../../extension/background/model/backgroundscript';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import * as chromeInternalMsgs from '../../utils/chrome';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { submitRecoveryPhrase } from './test/fillRecoveryPhrase';
import { travelToRestoreAccount } from './test/travelToRestoreAccount';

withChainsDescribe(
  'DOM > Feature > Restore Account',
  (): void => {
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

    it(`should restore profile from mnemonic`, async (): Promise<void> => {
      const RestoreDOM = await travelToRestoreAccount(store);

      const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
      await submitRecoveryPhrase(RestoreDOM, mnemonic);
    }, 55000);
  },
);
