import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import RecoveryWords from "./index";

storiesOf(CHROME_EXTENSION_ROOT, module).add("Recovery Words page", () => (
  <Storybook>
    <RecoveryWords />
  </Storybook>
));
