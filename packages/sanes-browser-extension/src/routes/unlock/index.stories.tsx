import { storiesOf } from "@storybook/react";
import React from "react";

import { CHROME_EXTENSION_ROOT, SanesStorybook } from "../../utils/storybook";
import Layout from "./index";

storiesOf(CHROME_EXTENSION_ROOT, module).add("Unlock page", () => (
  <SanesStorybook>
    <Layout />
  </SanesStorybook>
));
