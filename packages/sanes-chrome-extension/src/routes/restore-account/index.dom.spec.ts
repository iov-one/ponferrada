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

    beforeAll(() => {
      const response: messages.CreatePersonaResponse = {
        accounts: [],
        mnemonic: 'badge cattle stool execute involve main mirror envelope brave scrap involve simple',
        txs: [],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (messages.sendCreatePersonaMessage as any) = jest.fn().mockReturnValue(async () => response);
    });

    beforeEach(
      (): void => {
        store = aNewStore();
      }
    );

    it(`should restore profile from mnemonic`, async (): Promise<void> => {
      const RestoreDOM = await travelToRestoreAccount(store);

      const mnemonic = 'degree tackle suggest window test behind mesh extra cover prepare oak script';
      await submitRecoveryPhrase(RestoreDOM, mnemonic);
    }, 55000);
  }
);
