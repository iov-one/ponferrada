import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import Block from "../Block";
import ActionMenu, { ActionMenuItem } from "./index";

const menuItems: ActionMenuItem[] = [
  { title: "Renew", action: () => action("Renew")() },
  { title: "Transfer iovname", action: () => action("Transfer iovname")() },
  { title: "Delete iovname", action: () => action("Delete iovname")() },
];

storiesOf(`${medulasRoot}/components`, module).add("ActionMenu", () => (
  <Storybook>
    <Block marginBottom={4} display="flex" justifyContent="center">
      <ActionMenu menuItems={menuItems} />
    </Block>
  </Storybook>
));
