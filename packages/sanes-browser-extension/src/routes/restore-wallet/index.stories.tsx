import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import SetMnemonicForm from "./components/SetMnemonicForm";
import SetPasswordForm from "./components/SetPasswordForm";

storiesOf(`${CHROME_EXTENSION_ROOT}/Restore Wallet`, module)
  .add(
    "Set Mnemonic page",
    (): JSX.Element => (
      <Storybook>
        <SetMnemonicForm onBack={action("back in history")} onSetMnemonic={action("password step")} />
      </Storybook>
    ),
  )
  .add(
    "Set Password page",
    (): JSX.Element => (
      <Storybook>
        <SetPasswordForm onBack={action("back in history")} onSetPassword={action("restore wallet")} />
      </Storybook>
    ),
  );
