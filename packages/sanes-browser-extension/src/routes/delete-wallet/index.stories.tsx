import { storiesOf } from "@storybook/react";
import React from "react";

import { sanesRoot, SanesStorybook } from "../../utils/storybook";
import DeleteWallet from "./index";

storiesOf(sanesRoot, module).add("Delete wallet page", () => (
  <SanesStorybook>
    <DeleteWallet />
  </SanesStorybook>
));
