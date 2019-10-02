import { storiesOf } from "@storybook/react";
import React from "react";

import { CHROME_EXTENSION_ROOT, SanesStorybook } from "../../utils/storybook";
import DeleteWallet from "./index";

storiesOf(CHROME_EXTENSION_ROOT, module).add("Delete wallet page", () => (
  <SanesStorybook>
    <DeleteWallet />
  </SanesStorybook>
));
