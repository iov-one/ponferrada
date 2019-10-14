import { storiesOf } from "@storybook/react";
import { Block } from "medulas-react-components";
import * as React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import NeumaBillboardMessage from "./NeumaBillboardMessage";

storiesOf(`${bierzoRoot}/BillboardMessage`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Nauma", () => (
    <DecoratedStorybook>
      <Block bgcolor="rgba(26, 26, 26, 0.3)" width="100%" height="100%" padding={4}>
        <NeumaBillboardMessage />
      </Block>
    </DecoratedStorybook>
  ));
