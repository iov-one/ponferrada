import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import Typography from "./index";
import { Storybook } from "../../utils/storybook";

storiesOf("Typography", module)
  .add("H4", () => (
    <Storybook>
      <Typography variant="h4">Main headings</Typography>
    </Storybook>
  ))
  .add("H5", () => (
    <Storybook>
      <Typography variant="h5">Subheadings</Typography>
    </Storybook>
  ));
