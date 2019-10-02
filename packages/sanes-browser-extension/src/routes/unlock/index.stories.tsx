import { storiesOf } from "@storybook/react";
import React from "react";

import { sanesRoot, SanesStorybook } from "../../utils/storybook";
import Layout from "./index";

storiesOf(sanesRoot, module).add("Unlock page", () => (
  <SanesStorybook>
    <Layout />
  </SanesStorybook>
));
