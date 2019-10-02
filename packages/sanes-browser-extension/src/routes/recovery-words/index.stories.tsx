import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { sanesRoot } from "../../utils/storybook";
import RecoveryWords from "./index";

storiesOf(sanesRoot, module).add("Recovery Words page", () => (
  <Storybook>
    <RecoveryWords />
  </Storybook>
));
