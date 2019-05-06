import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { travelToRestoreAccount } from './test/travelToRestoreAccount';
import { submitRecoveryPhrase } from './test/fillRecoveryPhrase';

withChainsDescribe(
  'DOM > Feature > Restore Account',
  (): void => {
    let store: Store<RootState>;

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
