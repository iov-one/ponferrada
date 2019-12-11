import { Address } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { PersonaProvider } from "../../context/PersonaProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { sanesRoot } from "../../utils/storybook";
import Layout from "./index";

const persona: GetPersonaResponse = {
  mnemonic: "",
  accounts: [{ label: "Account 0", iovAddress: "" as Address }],
  balances: [],
  starnames: [],
};

storiesOf(`${sanesRoot}/Welcome page`, module)
  .add("With persona", () => (
    <PersonaProvider persona={persona} hasStoredPersona={true}>
      <Storybook>
        <Layout />
      </Storybook>
    </PersonaProvider>
  ))
  .add("Without persona", () => (
    <PersonaProvider persona={null} hasStoredPersona={false}>
      <Storybook>
        <Layout />
      </Storybook>
    </PersonaProvider>
  ));
