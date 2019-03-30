import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/testhelper';
import { travelToSignup, submitAccountForm } from './testUtils/signupUtils';
import Signup from './index';

describe('DOM > Feature > Signup', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  mayTestChains(
    `should redirect to show mnemonic step`,
    async () => {
      const signupDOM = await travelToSignup(store);
      await submitAccountForm(signupDOM);

      //Check for opened toast message
      const signupComponent = TestUtils.findRenderedComponentWithType(
        signupDOM,
        Signup
      );

      expect(signupComponent.state.step).toBe('second');
    },
    55000
  );
});
