import { createMemoryHistory } from "history";
import { Storybook, ToastProvider } from "medulas-react-components";
import * as React from "react";
import { Router } from "react-router";

import { PersonaProvider } from "../../context/PersonaProvider";

export const sanesRoot = "Sanes Browser Extension";

const storybookHistory = createMemoryHistory();

interface Props {
  readonly children: React.ReactNode;
}

export const SanesStorybook = ({ children }: Props): JSX.Element => {
  return (
    <Storybook>
      <ToastProvider>
        <PersonaProvider persona={null} hasStoredPersona={false}>
          <Router history={storybookHistory}>{children}</Router>
        </PersonaProvider>
      </ToastProvider>
    </Storybook>
  );
};
