import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import Typography from "../Typography";
import PageLayout from "./index";

storiesOf(`${medulasRoot}/components`, module).add("PageLayout", () => (
  <Storybook>
    <PageLayout primaryTitle="Title" title="storybook" onBack={action("clicking on back button")}>
      <Typography variant="h6">Layout content</Typography>
    </PageLayout>
  </Storybook>
));
