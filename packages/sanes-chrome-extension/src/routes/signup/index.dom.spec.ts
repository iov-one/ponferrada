import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/test/testExecutor';
import { submitAccountForm, handlePassPhrase, handleSecurityHint } from './test/fillSignupForm';
import { travelToSignup } from './test/travelToSignup';
import { randomString } from '../../utils/test/random';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { ACCOUNT_STATUS_ROUTE } from '../paths';

describe('DOM > Feature > Signup', (): void => {
  let store: Store<RootState>;

  beforeEach(
    (): void => {
      store = aNewStore();
    }
  );

  mayTestChains(
    `should finish the signup three steps process`,
    async (): Promise<void> => {
      const signupDOM = await travelToSignup(store);
      const accountName = randomString(10);

      await submitAccountForm(signupDOM, accountName);
      await handlePassPhrase(signupDOM);
      await handleSecurityHint(signupDOM, accountName);
      await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);
    },
    55000
  );
});
