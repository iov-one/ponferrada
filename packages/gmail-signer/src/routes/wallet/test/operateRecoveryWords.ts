import TestUtils from "react-dom/test-utils";
import { sleep } from "ui-logic";

import { mockcheckPassword } from "../../../extension/background/model/persona/test/persona";
import { input, submit } from "../../../utils/test/dom";

export const submitPasswordForm = async (recoveryWordsDom: React.Component): Promise<void> => {
  const form = TestUtils.findRenderedDOMComponentWithTag(recoveryWordsDom, "form");
  const passwordInput = TestUtils.findRenderedDOMComponentWithTag(recoveryWordsDom, "input");
  input(passwordInput, "12345678");
  mockcheckPassword();
  await submit(form);
  await sleep(2000);
};

export const getRenderedMnemonic = (recoveryWordsDom: React.Component): Element => {
  const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(recoveryWordsDom, "p");

  return paragraphs[paragraphs.length - 1];
};
