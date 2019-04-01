import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/test/testExecutor';
import {
  submitAccountForm,
  continueToSecurityHintForm,
} from './test/fillSignupForm';
import { travelToSignup } from './test/travelToSignup';

describe('DOM > Feature > Signup', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  mayTestChains(
    `should redirect to show mnemonic step and check buttons`,
    async () => {
      const signupDOM = await travelToSignup(store);
      await submitAccountForm(signupDOM);

      const recoveryBtns = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'button'
      );
      expect(recoveryBtns.length).toBe(2);

      //Go to next security phrase view
      await continueToSecurityHintForm(signupDOM);
      const hintBtns = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'button'
      );
      expect(hintBtns.length).toBe(2);
    },
    55000
  );
});
