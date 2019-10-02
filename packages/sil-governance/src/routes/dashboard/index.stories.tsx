import { storiesOf } from "@storybook/react";
import React from "react";

import { ElectionFilter } from "../../components/AsideFilter";
import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import Dashboard from "./index";

storiesOf(silRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Dashboard page", () => (
    <DecoratedStorybook>
      <Dashboard filter={ElectionFilter.All} />
    </DecoratedStorybook>
  ));
