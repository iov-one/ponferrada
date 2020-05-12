import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Upgrade from "./";

storiesOf(bierzoRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Terms", () => (
    <DecoratedStorybook>
      <Upgrade />
    </DecoratedStorybook>
  ));
