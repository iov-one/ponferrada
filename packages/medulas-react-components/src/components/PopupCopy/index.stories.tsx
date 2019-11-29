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
          <Typography inline>Some simple text</Typography>
        </PopupCopy>
        <Typography>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
          leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
          with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Typography>
      </Block>
    </Storybook>
  );
});
