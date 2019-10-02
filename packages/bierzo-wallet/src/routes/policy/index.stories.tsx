import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Policy from "./index";

storiesOf(bierzoRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Policy", () => (
    <DecoratedStorybook>
      <Policy />
    </DecoratedStorybook>
  ));
