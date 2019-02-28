import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import Typography from "./index";
import { Storybook } from "../../utils/storybook";

storiesOf("Typography", module).add("H4", () => (
  <Storybook>
    <Typography variant="subtitle1" color="primary">
      H4
    </Typography>
    <Typography variant="h4">Main headings</Typography>
    <Typography variant="subtitle1" color="primary">
      H5
    </Typography>
    <Typography variant="h5">Heading 2</Typography>
    <Typography variant="subtitle1" color="primary">
      H6
    </Typography>
    <Typography variant="h6">Subheading</Typography>
    <Typography variant="subtitle1" color="primary">
      body1
    </Typography>
    <Typography variant="body1">Lorem ipsum dolor sit amet</Typography>
    <Typography variant="subtitle1" color="primary">
      body2
    </Typography>
    <Typography variant="body2">Lorem ipsum dolor sit amet</Typography>
    <Typography variant="subtitle1" color="primary">
      subtitle1
    </Typography>
    <Typography variant="subtitle1">Text field label</Typography>
    <Typography variant="subtitle1" color="primary">
      subtitle2
    </Typography>
    <Typography variant="subtitle2">Text field label</Typography>
  </Storybook>
));
