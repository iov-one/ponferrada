import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import Terms from "./";

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    "Terms",
    (): JSX.Element => (
      <DecoratedStorybook>
        <Terms />
      </DecoratedStorybook>
    ),
  );
