import { storiesOf } from "@storybook/react";
import React from "react";

import { ElectionFilter } from "../../components/AsideFilter";
import DecoratedStorybook, { governanceRoot } from "../../utils/storybook";
import Dashboard from "./index";

storiesOf(governanceRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Dashboard page", () => (
    <DecoratedStorybook>
      <Dashboard filter={ElectionFilter.All} />
    </DecoratedStorybook>
  ));
