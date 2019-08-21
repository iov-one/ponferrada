import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import Policy from "./index";

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    "Policy",
    (): JSX.Element => (
      <DecoratedStorybook>
        <Policy />
      </DecoratedStorybook>
    ),
  );
