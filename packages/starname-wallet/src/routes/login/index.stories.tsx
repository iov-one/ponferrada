import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Login from "./index";

storiesOf(bierzoRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Login page", () => (
    <DecoratedStorybook>
      <Login />
    </DecoratedStorybook>
  ));
