import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import Layout from "./components/index";

export const REGISTER_USERNAME_PATH = "Register Username";

async function onSubmit(_: object): Promise<void> {
  action("onSubmit")();
}

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    REGISTER_USERNAME_PATH,
    (): JSX.Element => (
      <DecoratedStorybook>
        <Layout onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)} onSubmit={onSubmit} />
      </DecoratedStorybook>
    ),
  );
