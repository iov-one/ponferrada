import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { governanceRoot } from "../../utils/storybook";
import Login from "./index";

storiesOf(governanceRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Login page", () => (
    <DecoratedStorybook>
      <Login />
    </DecoratedStorybook>
  ));
