import { MedulasThemeProvider, ToastProvider } from "medulas-react-components";
import * as React from "react";
import TestUtils from "react-dom/test-utils";

import { PersonaProvider } from "../../context/PersonaProvider";
import { RequestProvider } from "../../context/RequestProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import Route from "../../routes";

class FakeDom extends React.Component<{ children: React.ReactNode }> {
  public render(): JSX.Element {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}

export const createDom = (
  requests: readonly Request[] = [],
  persona: GetPersonaResponse = null,
  hasStoredPersona = false,
): React.Component =>
  TestUtils.renderIntoDocument(
    <FakeDom>
      <MedulasThemeProvider>
        <ToastProvider>
          <PersonaProvider persona={persona} hasStoredPersona={hasStoredPersona}>
            <RequestProvider initialRequests={requests}>
              <Route />
            </RequestProvider>
          </PersonaProvider>
        </ToastProvider>
      </MedulasThemeProvider>
    </FakeDom>,
  ) as any;

export const click = async (element: Element): Promise<void> => {
  const onClick = async (): Promise<void> =>
    TestUtils.Simulate.click(element, {
      button: 0,
    });

  await TestUtils.act(onClick as any);
};

export const input = (field: Element, value: any): void => {
  TestUtils.act(() => {
    TestUtils.Simulate.change(field, {
      target: { value } as any,
    });
  });
};

export const check = async (checkbox: Element): Promise<void> => {
  const onCheck = async (): Promise<void> =>
    TestUtils.Simulate.change(checkbox, {
      target: { checked: true } as any,
    });

  await TestUtils.act(onCheck as any);
};

export const submit = async (form: Element): Promise<void> => {
  const onSubmit = async (): Promise<void> => TestUtils.Simulate.submit(form);

  await TestUtils.act(onSubmit as any);
};
