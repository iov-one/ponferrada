import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { PersonaManager } from '../../logic/persona';
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

    afterEach(async () => {
      // Every restore account test will create a Persona on its own. Here we make
      // sure that the persona instance is destroyed after each test.
      await PersonaManager.destroy();
    });

    it(`should restore profile from mnemonic`, async (): Promise<void> => {
      const RestoreDOM = await travelToRestoreAccount(store);

      const mnemonic = 'degree tackle suggest window test behind mesh extra cover prepare oak script';
      await submitRecoveryPhrase(RestoreDOM, mnemonic);
    }, 55000);
  }
);
