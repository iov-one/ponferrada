import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { PersonaProvider } from "../../context/PersonaProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import Layout from "./index";

const persona: GetPersonaResponse = {
  mnemonic: "",
  accounts: [{ label: "Account 0" }],
  txs: [],
};

storiesOf(`${CHROME_EXTENSION_ROOT}/Welcome page`, module)
  .add(
    "With persona",
    (): JSX.Element => (
      <PersonaProvider persona={persona} hasStoredPersona={true}>
        <Storybook>
          <Layout />
        </Storybook>
      </PersonaProvider>
    ),
  )
  .add(
    "Without persona",
    (): JSX.Element => (
      <PersonaProvider persona={null} hasStoredPersona={false}>
        <Storybook>
          <Layout />
        </Storybook>
      </PersonaProvider>
    ),
  );
