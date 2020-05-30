import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { sanesRoot } from "../../utils/storybook";
import NewWalletForm from "./components/NewWalletForm";
import SecurityHintForm from "./components/SecurityHintForm";
import ShowWordsForm from "./components/ShowWordsForm";

const exampleMnemonic =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

storiesOf(`${sanesRoot}/Create Wallet`, module)
  .add("New Wallet page", () => (
    <Storybook>
      <NewWalletForm onBack={action("back in history")} onCreateWallet={action("next step")} />
    </Storybook>
  ))
  .add("Recovery Words page", () => (
    <Storybook>
      <ShowWordsForm
        mnemonic={exampleMnemonic}
        onBack={action("back in history")}
        onHintPassword={action("hint step")}
      />
    </Storybook>
  ))
  .add("Security Hint page", () => (
    <Storybook>
      <SecurityHintForm onBack={action("back in history")} onSaveHint={action("save hint")} />
    </Storybook>
  ));
