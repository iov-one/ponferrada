import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { travelToRestoreAccount } from './test/travelToRestoreAccount';
import { submitRecoveryPhrase } from './test/fillRecoveryPhrase';
import * as messages from '../../extension/messages';

withChainsDescribe(
  'DOM > Feature > Restore Account',
  (): void => {
    let store: Store<RootState>;

    beforeEach(() => {
      store = aNewStore();

      const response: messages.CreatePersonaResponse = {
        accounts: [],
        mnemonic: 'badge cattle stool execute involve main mirror envelope brave scrap involve simple',
        txs: [],
      };
      jest.spyOn(messages, 'sendCreatePersonaMessage').mockResolvedValueOnce(response);
    });

    it(`should restore profile from mnemonic`, async (): Promise<void> => {
      const RestoreDOM = await travelToRestoreAccount(store);

      const mnemonic = 'badge cattle stool execute involve main mirror envelope brave scrap involve simple';
      await submitRecoveryPhrase(RestoreDOM, mnemonic);
    }, 55000);
  },
);
