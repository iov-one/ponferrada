import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";

import DecoratedStorybook, { VOTER_ROOT } from "../../utils/storybook";
import BlockchainTime from "./index";

storiesOf(VOTER_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("BlockchainTime", () => (
    <DecoratedStorybook>
      <BlockchainTime lastBlockHeight={156484} lastBlockTime={new ReadonlyDate(1568619550 * 1000)} />
    </DecoratedStorybook>
  ));
