import TestUtils from 'react-dom/test-utils';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { ACCOUNT_STATUS_ROUTE } from '../../paths';

export const submitRecoveryPhrase = async (
  AccountSubmitDom: React.Component,
  mnemonic: string
): Promise<void> => {
  const textarea = TestUtils.scryRenderedDOMComponentsWithTag(AccountSubmitDom, 'textarea');

  expect(textarea.length).toBe(1);

  const recoveryPhraseField = textarea[0];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(recoveryPhraseField, {
        target: {
          value: mnemonic,
        },
      } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  );

  const form = TestUtils.findRenderedDOMComponentWithTag(AccountSubmitDom, 'form');

  const submitForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(form);
    await findRenderedDOMComponentWithId(AccountSubmitDom, ACCOUNT_STATUS_ROUTE);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(submitForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any
};
