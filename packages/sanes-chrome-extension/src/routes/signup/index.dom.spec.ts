import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/test/testExecutor';
import {
  submitAccountForm,
  handlePassPhrase,
  handleSecurityHint,
} from './test/fillSignupForm';
import { travelToSignup } from './test/travelToSignup';
import { randomString } from '../../utils/test/random';

describe('DOM > Feature > Signup', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  mayTestChains(
    `should finish the signup three steps process`,
    async () => {
      const signupDOM = await travelToSignup(store);
      const accountName = randomString(10);

      await submitAccountForm(signupDOM, accountName);
      await handlePassPhrase(signupDOM);
      await handleSecurityHint(signupDOM, accountName);

      // TODO travel to correct view after signing up
    },
    55000
  );
});
