import { storiesOf } from "@storybook/react";
import { Block } from "medulas-react-components";
import * as React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import LedgerBillboardMessage from "./LedgerBillboardMessage";
import NeumaBillboardMessage from "./NeumaBillboardMessage";

storiesOf(`${bierzoRoot}/BillboardMessage`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Neuma", () => (
    <DecoratedStorybook>
      <Block bgcolor="rgba(26, 26, 26, 0.3)" width="100%" height="100%" padding={4}>
        <NeumaBillboardMessage text="Please authorize request in Neuma Browser Extension to continue." />
      </Block>
    </DecoratedStorybook>
  ))
  .add("Ledger", () => (
    <DecoratedStorybook>
      <Block bgcolor="rgba(26, 26, 26, 0.3)" width="100%" height="100%" padding={4}>
        <LedgerBillboardMessage text="Waiting for Ledger device to provide identity..." />
      </Block>
    </DecoratedStorybook>
  ));
