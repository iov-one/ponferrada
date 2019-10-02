import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import Block from "../Block";
import Switch from "./index";

storiesOf(`${medulasRoot}/components`, module).add("Switch", () => (
  <Storybook>
    <Block>
      <Switch color="primary" label="With label" />
    </Block>
    <Block>
      <Switch color="primary" />
    </Block>
  </Storybook>
));
