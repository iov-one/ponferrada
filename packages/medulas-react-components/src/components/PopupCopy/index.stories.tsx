import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import Block from "../Block";
import Typography from "../Typography";
import PopupCopy from "./index";

storiesOf(`${medulasRoot}/components`, module).add("Popup copy", () => {
  return (
    <Storybook>
      <Block>
        <PopupCopy textToCopy={"Text to copy"}>
          <Typography inline>Text to copy</Typography>
        </PopupCopy>
      </Block>
    </Storybook>
  );
});
