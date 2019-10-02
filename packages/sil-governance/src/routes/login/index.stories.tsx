import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import Login from "./index";

storiesOf(silRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Login page", () => (
    <DecoratedStorybook>
      <Login />
    </DecoratedStorybook>
  ));
