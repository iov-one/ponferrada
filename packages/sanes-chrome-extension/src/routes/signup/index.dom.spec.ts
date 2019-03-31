import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/testhelper';
import {
  travelToSignup,
  submitAccountForm,
  continueToSecurityHintForm,
} from './testUtils/signupUtils';
import Signup from './index';

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

      //Check for current step
      const signupComponent = TestUtils.findRenderedComponentWithType(
        signupDOM,
        Signup
      );
      expect(signupComponent.state.step).toBe('second');

      const recoveryBtns = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'button'
      );
      expect(recoveryBtns.length).toBe(2);

      //Go to next security phrase view
      await continueToSecurityHintForm(signupDOM);
      expect(signupComponent.state.step).toBe('third');
      const hintBtns = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'button'
      );
      expect(hintBtns.length).toBe(2);
      expect(signupComponent.state.step).toBe('third');
    },
    55000
  );
});
