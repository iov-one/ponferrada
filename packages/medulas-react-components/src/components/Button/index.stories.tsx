import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./index";

storiesOf("Button", module)
  .add("with text", () => <Button onClick={action("clicked")}>Buttoon</Button>)

  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>
      <span role="img" aria-label="Express mood">
        😀 😎 👍 💯
      </span>
    </Button>
  ))

  .add("with a theme provider", () => <Button onClick={action("clicked")}>Button</Button>);
