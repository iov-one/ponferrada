import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Typography } from "medulas-react-components";
import React from "react";

import { sanesRoot, SanesStorybook } from "../utils/storybook";
import NeumaPageLayout from "./NeumaPageLayout";

storiesOf(`${sanesRoot}/Components`, module).add("NeumaPageLayout", () => (
  <SanesStorybook>
    <NeumaPageLayout primaryTitle="Long" title="title" onBack={action("clicking on back button")}>
      <Typography>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
        labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
        et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
        ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      </Typography>
    </NeumaPageLayout>
  </SanesStorybook>
));
