import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { randomString } from '../../utils/test/random';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { travelToLogin } from './test/travelToLogin';

describe('DOM > Feature > Login', (): void => {
  let store: Store<RootState>;
  let loginDom: React.Component;

  beforeEach(
    async (): Promise<void> => {
      store = aNewStore();
      loginDom = await travelToLogin(store);
    },
  );

  it('should have a "Password" input', () => {
    const passwordInput = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'input');
    expect(passwordInput.getAttribute('placeholder')).toBe('Password');
  });

  it('should have two buttons: Go back arrow and "Continue"', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'button');
    expect(buttons.length).toBe(2);

    const [backButton, continueButton] = buttons;
    expect(backButton.getAttribute('aria-label')).toBe('Go back');
    expect(continueButton.textContent).toBe('Continue');
  });

  it('should have a "Restore account" link', () => {
    const restoreAccountLink = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'a');
    expect(restoreAccountLink.textContent).toBe('Restore account');
  });

  it('should show toast message', async (): Promise<void> => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(loginDom, 'input');
    const passwordInput = inputs[0];

    TestUtils.act(
      (): void => {
        TestUtils.Simulate.change(passwordInput, {
          target: { value: randomString(10) },
        } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
      },
    );

    const form = TestUtils.findRenderedDOMComponentWithTag(loginDom, 'form');
    const submitForm = async (): Promise<void> => {
      TestUtils.Simulate.submit(form);
    };
    // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
    await TestUtils.act(submitForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any

    //Will throw an exception if toast component will not be found
    await findRenderedDOMComponentWithId(loginDom, 'toast-provider');
  }, 55000);
});
